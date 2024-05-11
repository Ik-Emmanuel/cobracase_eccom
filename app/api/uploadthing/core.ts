import { createUploadthing, type FileRouter } from "uploadthing/next";
import { z } from 'zod';
import sharp from "sharp"
import { db } from "@/db";


const f = createUploadthing();

// const auth = (req: Request) => ({ id: "fakeId" }); // Fake auth function

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    // Define as many FileRoutes as you like, each with a unique routeSlug
    imageUploader: f({ image: { maxFileSize: "4MB" } })
        .input(z.object({
            configId: z.string().optional()
        }))
        .middleware(async ({ input }) => {
            return { input }
        })

        .onUploadComplete(async ({ metadata, file }) => {
            const { configId } = metadata.input

            // fetch the image
            const res = await fetch(file.url)
            // convert it to a buffer 
            const buffer = await res.arrayBuffer()

            // get img metadata
            const imgMetadata = await sharp(buffer).metadata()
            const {width, height} = imgMetadata

            if (!configId){
                const configuration = await  db.configuration.create({
                    data: {
                        imageUrl: file.url, 
                        height: height || 500,
                        width: width || 500,
                    }
                })

                return {configId: configuration.id}
            }else{
                const updatedConfiguration = await db.configuration.update({
                    where: {
                        id: configId
                    },
                    data:
                    {
                    croppedImageUrl: file.url
                    }
                })
                return {configId: updatedConfiguration.id}
            }
        }),


    // // Set permissions and file types for this FileRoute
    // .middleware(async ({ req }) => {
    //     // This code runs on your server before upload
    //     const user = await auth(req);

    //     // If you throw, the user will not be able to upload
    //     if (!user) throw new UploadThingError("Unauthorized");

    //     // Whatever is returned here is accessible in onUploadComplete as `metadata`
    //     return { userId: user.id };
    // })


    // .onUploadComplete(async ({ metadata, file }) => {
    //     // This code RUNS ON YOUR SERVER after upload
    //     // console.log("Upload complete for userId:", metadata.userId);

    //     // console.log("file url", file.url);

    //     // !!! Whatever is returned here is sent to the client side `onClientUploadComplete` callback
    //     return { uploadedBy: metadata.userId };
    // }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;