import { Bucket } from "encore.dev/storage/objects";

export const snippetImages = new Bucket("snippet-images", {
  public: true,
});
