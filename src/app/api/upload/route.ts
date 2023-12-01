import { uploadBuffer } from "../azure";

export async function POST(req) {
  const files = await req.formData();
  // iterate over files

  for (const file of files) {
    const fileData = files.get(file[0]);
    const bytes = await fileData.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await uploadBuffer(buffer, fileData.name);
  }

  return Response.json({ message: "SUCCESS" });
}
