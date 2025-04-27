import { useState } from 'react';
    import { Form, useActionData, useNavigation } from '@remix-run/react';
    import { json, redirect, type ActionFunctionArgs, unstable_createMemoryUploadHandler, unstable_parseMultipartFormData } from "@remix-run/node";
    import { addUser } from '~/utils/db.server'; // Updated import
    import AuthForm from '~/components/AuthForm'; // Assuming AuthForm is updated
    import { Alert, Box, Typography } from '@mui/material';

    // Action function to handle form submission
    export const action = async ({ request }: ActionFunctionArgs) => {
      // Use unstable_createMemoryUploadHandler for file uploads in WebContainer
      const uploadHandler = unstable_createMemoryUploadHandler({
        maxPartSize: 5 * 1024 * 1024, // 5MB limit for photos
      });
      const formData = await unstable_parseMultipartFormData(request, uploadHandler);

      const name = formData.get('name')?.toString();
      const age = formData.get('age')?.toString();
      const hobby = formData.get('hobby')?.toString();
      const qualification = formData.get('qualification')?.toString();
      const role = formData.get('role')?.toString();
      const interests = formData.get('interests')?.toString();
      const place = formData.get('place')?.toString();
      const income = formData.get('income')?.toString();
      const bio = formData.get('bio')?.toString(); // Added bio
      const photo = formData.get('photo') as File; // Get the file

      // Basic validation
      const errors: Record<string, string> = {};
      if (!name) errors.name = "Name is required";
      if (!age) errors.age = "Age is required";
      if (!photo || photo.size === 0) errors.photo = "Photo is required";
      if (photo && photo.size > 5 * 1024 * 1024) errors.photo = "Photo size must be less than 5MB";
      if (photo && !photo.type.startsWith('image/')) errors.photo = "Invalid file type, please upload an image.";


      let ageNum: number | null = null;
      if (age) {
        ageNum = parseInt(age, 10);
        if (isNaN(ageNum) || ageNum <= 0) {
          errors.age = "Age must be a valid positive number";
        }
      } else {
         errors.age = "Age is required"; // Ensure age is provided
      }


      let incomeNum: number | null = null;
      if (income) {
        incomeNum = parseInt(income, 10);
        if (isNaN(incomeNum)) {
          errors.income = "Income must be a number";
        }
      }

      if (Object.keys(errors).length > 0) {
        return json({ errors, values: Object.fromEntries(formData) }, { status: 400 });
      }

      // If validation passes and ageNum is not null
      if (ageNum !== null) {
          try {
            const photoBuffer = await photo.arrayBuffer(); // Get the file content as ArrayBuffer

            const result = await addUser({
              name: name!,
              age: ageNum,
              photoBuffer: photoBuffer,
              photoType: photo.type,
              hobby,
              qualification,
              role,
              interests,
              place,
              income: incomeNum,
              bio, // Pass bio
            });

            if ('error' in result) {
              return json({ errors: { form: result.error }, values: Object.fromEntries(formData) }, { status: 500 });
            }

            // Redirect to a success page or profile page after successful registration
            // For now, let's redirect to the index page
            return redirect("/"); // Adjust as needed, maybe to /profile/{result.id}

          } catch (error) {
            console.error("Registration failed:", error);
            return json({ errors: { form: "An unexpected error occurred during registration." }, values: Object.fromEntries(formData) }, { status: 500 });
          }
      } else {
         // This case should technically not be reached due to prior validation, but added for safety
         return json({ errors: { age: "Age is required and must be valid." }, values: Object.fromEntries(formData) }, { status: 400 });
      }
    };

    // Component for the registration page
    export default function Register() {
      const actionData = useActionData<typeof action>();
      const navigation = useNavigation();
      const isLoading = navigation.state === 'submitting' || navigation.state === 'loading';

      return (
        <Box sx={{ my: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
           <Typography variant="h4" component="h1" gutterBottom>
             Join Oru Kozhikkodan Date
           </Typography>
           {actionData?.errors?.form && (
             <Alert severity="error" sx={{ mb: 2, width: '100%', maxWidth: 400 }}>
               {actionData.errors.form}
             </Alert>
           )}
           {/* We pass the Form component to AuthForm to handle submission */}
           <AuthForm
             Form={Form}
             isLoading={isLoading}
             errors={actionData?.errors}
             defaultValues={actionData?.values}
           />
        </Box>
      );
    }