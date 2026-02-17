#!/bin/sh

echo "starting setting up the ExamEase"

set -e

echo "checking for the environment file"
if [ -f ".env" ]; then
    echo "environemnt file exists"
else 
    if [ -f ".env.example" ];then
    cp .env.example .env
else 
    echo "envirnment files not found"
fi
fi

echo "checking the pnpm exist?"
if ! command -v pnpm >/dev/null 2>&1; then
echo "PNPM is not installed. Installing PNPM globally..."

if command -v npm >/dev/null 2>&1; then
  npm install -g pnpm || echo "Failed to install PNPM via npm."
echo "PNPM installed successfully."
else
    echo "Neither PNPM nor NPM is installed. Install Node.js first."
fi
else
     echo "PNPM already installed."
fi


echo "installing the dependecies"

pnpm install

echo "generating the prisma"

pnpm prisma generate

echo "seeding the data in database"

pnpm run seed

echo "Setup completed!!"
echo "running the project"

pnpm run dev

