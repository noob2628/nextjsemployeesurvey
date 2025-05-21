-- CreateTable
CREATE TABLE "Survey" (
    "id" SERIAL NOT NULL,
    "employeeName" TEXT NOT NULL,
    "employeeEmail" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "workLifeBalance" INTEGER NOT NULL,
    "jobSatisfaction" INTEGER NOT NULL,
    "feedback" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Survey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Survey_employeeEmail_key" ON "Survey"("employeeEmail");
