"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { Course } from "@/interfaces/Course";
import {
  uploadImageToCloudinary,
  uploadVideoToCloudinary,
} from "@/utils/uploadToCloudinary";
import { getServerSession } from "next-auth";
import { ActionResponse } from "@/lib/actionResponse";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { db } from "@/services/firebase";

interface FormDataObject {
  [key: string]: string | File | FormDataObject | Array<string | File>;
}

const extractFormData = (formData: FormData): FormDataObject => {
  const data: FormDataObject = {};

  formData.forEach((value, key) => {
    // Handle nested objects and arrays based on key format
    const keyParts = key.split(/[\[\]]/).filter(Boolean);
    let current = data;

    keyParts.forEach((part, index) => {
      if (index === keyParts.length - 1) {
        if (Array.isArray(current[part])) {
          (current[part] as Array<string | File>).push(value);
        } else if (typeof current[part] !== "undefined") {
          current[part] = [current[part] as string | File, value];
        } else {
          current[part] = value;
        }
      } else {
        if (!current[part]) {
          current[part] = {};
        }
        current = current[part] as FormDataObject;
      }
    });
  });

  return data;
};

const getFileUri = async (file: File) => {
  const fileBuffer = await file.arrayBuffer();

  const mimeType = file.type;
  const encoding = "base64";
  const base64Data = Buffer.from(fileBuffer).toString("base64");

  // this will be used to upload the file
  return "data:" + mimeType + ";" + encoding + "," + base64Data;
};

export const uploadCourse = async (formData: FormData) => {
  const data = extractFormData(formData);
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;

  if (!userId) {
    const res: ActionResponse = {
      status: "ERROR",
      message: "User Id is required",
      data: null,
    };
    return res;
  }

  if (session?.user.role !== "creator") {
    const res: ActionResponse = {
      status: "ERROR",
      message: "You are not authorized to perform this action",
      data: null,
    };
    return res;
  }

  const course_data: Course = {
    title: "",
    description: "",
    price: "",
    thumbnailUrl: "",
    created_at: "",
    updated_at: "",
    createdBy: {
      id: "",
      firstName: "",
      lastName: "",
      email: "",
    },
    sections: [],
  };

  let sectionId = 1;
  for (const [_key, value] of Object.entries(data.sections)) {
    const section = value as FormDataObject;
    const video = section.video as File;
    const title = section.title as string;

    const videoUri = await getFileUri(video);
    const res = await uploadVideoToCloudinary(videoUri, "sections");

    course_data.sections.push({
      title: title,
      videoUrl: res.secure_url,
      duration: res.duration,
      id: sectionId,
    });

    sectionId++;
  }

  const thumbnailUri = await getFileUri(data.thumbnail as File);
  const thumbnail_url = await uploadImageToCloudinary(
    thumbnailUri,
    "thumbnails"
  );

  course_data.title = data.title as string;
  course_data.description = data.description as string;
  course_data.price = data.price as string;
  course_data.thumbnailUrl = thumbnail_url.secure_url;
  course_data.created_at = new Date().toISOString();
  course_data.updated_at = new Date().toISOString();

  const docRef = doc(db, "users", userId);

  const res = await getDoc(docRef);
  const userData = res.data();

  if (!userData) {
    const res: ActionResponse = {
      status: "ERROR",
      message: "User not found",
      data: null,
    };
    return res;
  }

  course_data.createdBy = {
    id: userId,
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
  };

  const newCourse = await addDoc(collection(db, "courses"), course_data);

  if (!newCourse.id) {
    const res: ActionResponse = {
      status: "ERROR",
      message: "An error occurred while creating the course",
      data: null,
    };
    return res;
  }

  const response: ActionResponse = {
    status: "SUCCESS",
    message: "Course created successfully",
    data: null,
  };
  return response;
};
