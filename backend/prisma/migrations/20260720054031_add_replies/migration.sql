-- CreateTable
CREATE TABLE "replies" (
    "id" TEXT NOT NULL,
    "inquiry_id" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "replies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "replies_inquiry_id_idx" ON "replies"("inquiry_id");

-- CreateIndex
CREATE INDEX "replies_sender_id_idx" ON "replies"("sender_id");

-- AddForeignKey
ALTER TABLE "replies" ADD CONSTRAINT "replies_inquiry_id_fkey" FOREIGN KEY ("inquiry_id") REFERENCES "inquiries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "replies" ADD CONSTRAINT "replies_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
