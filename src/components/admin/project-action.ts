"use server";

import type { ProjectFormValues } from "@/lib/schemas";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/firebase/config";
import { ref, update, remove, push } from "firebase/database";

// Project Actions
export async function createProjectAction(values: ProjectFormValues) {
  try {
    const technologiesArray = values.technologies
      .split(',')
      .map(tech => tech.trim())
      .filter(Boolean);
      
    const imagesArray = values.images.split('\n').map(url => url.trim()).filter(Boolean);

    const projectData = {
      title: values.title.trim(),
      shortDescription: values.shortDescription.trim(),
      description: values.description.trim(),
      images: imagesArray,
      dataAiHint: values.dataAiHint?.trim() || '',
      technologies: technologiesArray,
      liveLink: values.liveLink?.trim() || '',
      repoLink: values.repoLink?.trim() || '',
      clientName: values.clientName?.trim() || '',
      category: values.category.trim(),
      iconName: values.iconName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await push(ref(db, 'projects'), projectData);
    
    revalidatePath('/admin/projects');
    revalidatePath('/[lang]/admin/projects', 'layout');
    revalidatePath('/projects');
    revalidatePath('/[lang]/projects', 'layout');
  } catch (error) {
    console.error('Error creating project:', error);
    if (typeof error?.digest === 'string' && error.digest.startsWith('NEXT_REDIRECT')) throw error;
    throw new Error('Failed to create project. Please try again.');
  }
  redirect('/admin/projects');
}

export async function updateProjectAction(id: string, values: ProjectFormValues) {
  try {
    if (!id) {
      throw new Error('Project ID is required');
    }

    const technologiesArray = values.technologies
      .split(',')
      .map(tech => tech.trim())
      .filter(Boolean);

    const imagesArray = values.images.split('\n').map(url => url.trim()).filter(Boolean);

    const projectData = {
      title: values.title.trim(),
      shortDescription: values.shortDescription.trim(),
      description: values.description.trim(),
      images: imagesArray,
      dataAiHint: values.dataAiHint?.trim() || '',
      technologies: technologiesArray,
      liveLink: values.liveLink?.trim() || '',
      repoLink: values.repoLink?.trim() || '',
      clientName: values.clientName?.trim() || '',
      category: values.category.trim(),
      iconName: values.iconName,
      updatedAt: new Date().toISOString(),
    };

    await update(ref(db, `projects/${id}`), projectData);
    
    revalidatePath('/admin/projects');
    revalidatePath('/[lang]/admin/projects', 'layout');
    revalidatePath(`/admin/projects/edit/${id}`);
    revalidatePath(`/[lang]/admin/projects/edit/${id}`, 'layout');
    revalidatePath('/projects');
    revalidatePath('/[lang]/projects', 'layout');
  } catch (error) {
    console.error('Error updating project:', error);
    if (typeof error?.digest === 'string' && error.digest.startsWith('NEXT_REDIRECT')) throw error;
    throw new Error('Failed to update project. Please try again.');
  }
  redirect('/admin/projects');
}

export async function deleteProjectAction(id: string) {
  try {
    if (!id) {
      throw new Error('Project ID is required');
    }

    await remove(ref(db, `projects/${id}`));
    
    revalidatePath('/admin/projects');
    revalidatePath('/[lang]/admin/projects', 'layout');
    revalidatePath('/projects');
    revalidatePath('/[lang]/projects', 'layout');
  } catch (error) {
    console.error('Error deleting project:', error);
    throw new Error('Failed to delete project. Please try again.');
  }
}
