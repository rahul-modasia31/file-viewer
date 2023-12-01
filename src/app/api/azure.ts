const fs = require("fs");
const path = require("path");

const { BlobServiceClient } = require("@azure/storage-blob");
const connectionString = `DefaultEndpointsProtocol=https;AccountName=${process.env.ACCOUNT_NAME};AccountKey=${process.env.ACCOUNT_KEY};EndpointSuffix=core.windows.net`;
const blobServiceClient =
  BlobServiceClient.fromConnectionString(connectionString);
const containerName = process.env.CONTAINER_NAME;
const userId = process.env.USER_ID;

console.log(process.env);

export async function getFileList() {
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blobList = containerClient.listBlobsFlat();
  const files = [];
  for await (const blob of blobList) {
    files.push(blob.name);
  }

  // split on '/'. first is userid, second is case id, third is file name
  const formattedFiles = files.reduce((acc, file) => {
    const [userId, caseId, fileName] = file.split("/");
    if (!acc[userId]) {
      acc[userId] = {};
    }
    if (!acc[userId][caseId]) {
      acc[userId][caseId] = [];
    }

    acc[userId][caseId].push(fileName);
    const transformedArray = [];

    return acc;
  }, {});
  const transformedArray = [];
  for (const userId in formattedFiles) {
    for (const caseId in formattedFiles[userId]) {
      const entry = {
        userId: userId,
        caseId: caseId,
        fileName: formattedFiles[userId][caseId],
      };
      transformedArray.push(entry);
    }
  }
  return transformedArray;
}
// Function to upload a buffer to Azure Blob Storage
async function uploadBuffer(buffer, blobName, contentType) {
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  await blockBlobClient.upload(buffer, buffer.length, {
    blobHTTPHeaders: { blobContentType: contentType },
  });
}

// Function to upload a readable stream to Azure Blob Storage
async function uploadStream(stream, blobName, contentType) {
  const chunks = [];
  const reader = stream.getReader();

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      chunks.push(value);
    }

    const buffer = Buffer.concat(chunks);
    await uploadBuffer(buffer, blobName, contentType);
  } finally {
    reader.releaseLock();
  }
}

// upload folder from html input
export async function uploadFolder(file) {
  const blobName = "your-azure-blob-name"; // Set your desired blob name
  const contentType = "application/octet-stream"; // Set your desired content type
  console.log(file);

  await uploadStream(file, blobName, contentType);
}
