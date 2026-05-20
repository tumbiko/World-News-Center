'use server';

import db from '@/lib/db';
import { comparePassword, hashPassword, setSessionCookie, getUserFromCookie } from '@/lib/auth';
import { Role, Category } from '@prisma/client';

export async function subscribeEmail(formData: FormData) {
  const email = formData.get('email') as string;
  
  if (!email || !email.includes('@')) {
    return { success: false, message: 'Please enter a valid email address.' };
  }

  try {
    const existing = await db.subscriber.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (existing) {
      if (existing.active) {
        return { success: true, message: 'You are already subscribed to our newsletter!' };
      }
      
      await db.subscriber.update({
        where: { email: email.trim().toLowerCase() },
        data: { active: true },
      });
      return { success: true, message: 'Welcome back! Your subscription is active again.' };
    }

    await db.subscriber.create({
      data: { email: email.trim().toLowerCase(), active: true },
    });

    return { success: true, message: 'Thank you! You have subscribed successfully.' };
  } catch (error) {
    console.error('Newsletter error:', error);
    return { success: false, message: 'Something went wrong. Please try again later.' };
  }
}

export async function signupAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;

  if (!email || !password || !name) {
    return { success: false, error: 'All fields are required.' };
  }

  if (password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters long.' };
  }

  try {
    const trimmedEmail = email.trim().toLowerCase();
    const existing = await db.user.findUnique({
      where: { email: trimmedEmail },
    });

    if (existing) {
      return { success: false, error: 'This email is already registered.' };
    }

    const passwordHash = await hashPassword(password);
    
    // Fallback/Safety Check: First user is automatically ADMIN
    const totalUsers = await db.user.count();
    let finalRole: Role = Role.READER;
    if (totalUsers === 0) {
      finalRole = Role.ADMIN;
    }

    const user = await db.user.create({
      data: {
        email: trimmedEmail,
        passwordHash,
        name: name.trim(),
        role: finalRole,
      },
    });

    // Set HTTP-Only Session Cookie
    await setSessionCookie({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    let redirectTo = '/';
    if (user.role === 'ADMIN') redirectTo = '/admin/dashboard';
    else if (user.role === 'UPLOADER') redirectTo = '/uploader/dashboard';
    else redirectTo = '/reader/dashboard';

    return { success: true, redirectTo };
  } catch (error) {
    console.error('Signup error:', error);
    return { success: false, error: 'Database error occurred. Please try again.' };
  }
}

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { success: false, error: 'Email and password are required.' };
  }

  try {
    const trimmedEmail = email.trim().toLowerCase();
    const user = await db.user.findUnique({
      where: { email: trimmedEmail },
    });

    if (!user) {
      return { success: false, error: 'Invalid email or password.' };
    }

    const match = await comparePassword(password, user.passwordHash);
    if (!match) {
      return { success: false, error: 'Invalid email or password.' };
    }

    // Set HTTP-Only Session Cookie
    await setSessionCookie({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    let redirectTo = '/';
    if (user.role === 'ADMIN') redirectTo = '/admin/dashboard';
    else if (user.role === 'UPLOADER') redirectTo = '/uploader/dashboard';
    else redirectTo = '/reader/dashboard';

    return { success: true, redirectTo };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Authentication failed. Please try again.' };
  }
}

export async function toggleLikeAction(articleId: string) {
  const user = await getUserFromCookie();
  
  if (!user) {
    return { success: false, error: 'You must be signed in to save/like stories!' };
  }

  try {
    const existingLike = await db.like.findUnique({
      where: {
        userId_articleId: {
          userId: user.userId,
          articleId,
        },
      },
    });

    let liked = false;
    if (existingLike) {
      await db.like.delete({
        where: { id: existingLike.id },
      });
      liked = false;
    } else {
      await db.like.create({
        data: {
          userId: user.userId,
          articleId,
        },
      });
      liked = true;
    }

    const count = await db.like.count({
      where: { articleId },
    });

    return { success: true, liked, count };
  } catch (error) {
    console.error('Like error:', error);
    return { success: false, error: 'Failed to process like request.' };
  }
}

export async function createArticleAction(formData: FormData) {
  const user = await getUserFromCookie();

  if (!user || (user.role !== 'UPLOADER' && user.role !== 'ADMIN')) {
    return { success: false, error: 'Unauthorized. You must be an approved uploader.' };
  }

  const title = formData.get('title') as string;
  const summary = formData.get('summary') as string;
  const content = formData.get('content') as string;
  const category = formData.get('category') as Category;
  const imageUrl = formData.get('imageUrl') as string;
  const videoUrl = formData.get('videoUrl') as string;
  const sourceUrl = formData.get('sourceUrl') as string;

  if (!title || !summary || !content || !category) {
    return { success: false, error: 'Title, category, summary, and content are required.' };
  }

  try {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-6);

    const isUploaderAdmin = user.role === 'ADMIN';

    await db.article.create({
      data: {
        title: title.trim(),
        slug,
        summary: summary.trim(),
        content: content.trim(),
        category,
        imageUrl: imageUrl ? imageUrl.trim() : null,
        videoUrl: videoUrl ? videoUrl.trim() : null,
        sourceUrl: sourceUrl ? sourceUrl.trim() : null,
        status: isUploaderAdmin ? 'APPROVED' : 'PENDING', // Admins auto-publish
        uploaderId: user.userId,
      },
    });

    return { 
      success: true, 
      message: isUploaderAdmin 
        ? 'Article published successfully!' 
        : 'Article submitted successfully! Awaiting administrator approval.' 
    };
  } catch (error) {
    console.error('Article creation error:', error);
    return { success: false, error: 'Failed to create article. Please check your data.' };
  }
}

export async function adminApproveArticleAction(articleId: string) {
  const user = await getUserFromCookie();

  if (!user || user.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized.' };
  }

  try {
    await db.article.update({
      where: { id: articleId },
      data: { status: 'APPROVED' },
    });
    return { success: true, message: 'Article approved and published!' };
  } catch (error) {
    console.error('Approve error:', error);
    return { success: false, error: 'Failed to approve article.' };
  }
}

export async function adminRejectArticleAction(articleId: string) {
  const user = await getUserFromCookie();

  if (!user || user.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized.' };
  }

  try {
    await db.article.update({
      where: { id: articleId },
      data: { status: 'REJECTED' },
    });
    return { success: true, message: 'Article rejected successfully.' };
  } catch (error) {
    console.error('Reject error:', error);
    return { success: false, error: 'Failed to reject article.' };
  }
}

export async function adminToggleTrendingAction(articleId: string) {
  const user = await getUserFromCookie();

  if (!user || user.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized.' };
  }

  try {
    const article = await db.article.findUnique({
      where: { id: articleId },
    });

    if (!article) return { success: false, error: 'Article not found.' };

    const updated = await db.article.update({
      where: { id: articleId },
      data: { isTrending: !article.isTrending },
    });

    return { 
      success: true, 
      message: updated.isTrending 
        ? 'Article is now marked as Trending!' 
        : 'Article removed from Trending list.' 
    };
  } catch (error) {
    console.error('Toggle trending error:', error);
    return { success: false, error: 'Failed to update trending status.' };
  }
}

export async function adminToggleFeaturedAction(articleId: string) {
  const user = await getUserFromCookie();

  if (!user || user.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized.' };
  }

  try {
    const article = await db.article.findUnique({
      where: { id: articleId },
    });

    if (!article) return { success: false, error: 'Article not found.' };

    const willBeFeatured = !article.isFeatured;

    if (willBeFeatured) {
      // De-feature all existing articles first (enforce single main hero)
      await db.article.updateMany({
        where: { isFeatured: true },
        data: { isFeatured: false },
      });
    }

    const updated = await db.article.update({
      where: { id: articleId },
      data: { isFeatured: willBeFeatured },
    });

    return { 
      success: true, 
      message: updated.isFeatured 
        ? 'Article is now featured in the top hero spot!' 
        : 'Article removed from featured spot.' 
    };
  } catch (error) {
    console.error('Toggle featured error:', error);
    return { success: false, error: 'Failed to update featured status.' };
  }
}

export async function adminUpdateUserRoleAction(targetUserId: string, newRole: Role) {
  const user = await getUserFromCookie();

  if (!user || user.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized.' };
  }

  try {
    await db.user.update({
      where: { id: targetUserId },
      data: { role: newRole },
    });
    return { success: true, message: `User role successfully updated to ${newRole}!` };
  } catch (error) {
    console.error('Update role error:', error);
    return { success: false, error: 'Failed to update user role.' };
  }
}



