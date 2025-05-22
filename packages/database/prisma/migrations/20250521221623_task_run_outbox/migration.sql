/*
  Warnings:

  - You are about to drop the `taskRun` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "taskRun" DROP CONSTRAINT "taskRun_taskId_fkey";

-- DropTable
DROP TABLE "taskRun";

-- CreateTable
CREATE TABLE "TaskRun" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,

    CONSTRAINT "TaskRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskRunOutbox" (
    "id" TEXT NOT NULL,
    "taskRunId" TEXT NOT NULL,

    CONSTRAINT "TaskRunOutbox_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TaskRunOutbox_taskRunId_key" ON "TaskRunOutbox"("taskRunId");

-- AddForeignKey
ALTER TABLE "TaskRun" ADD CONSTRAINT "TaskRun_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskRunOutbox" ADD CONSTRAINT "TaskRunOutbox_taskRunId_fkey" FOREIGN KEY ("taskRunId") REFERENCES "TaskRun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
