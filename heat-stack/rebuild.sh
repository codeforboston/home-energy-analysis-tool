set -x
rm -rf node_modules
rm prisma/data.db
rm -rf build
cd ../python
python3.12 -m venv venv
source venv/bin/activate
pip install -e .
pip install -r requirements_dev.txt
set +x
cd ../heat-stack
nvm use 22
set  -x
npm install
npm run buildpy
npm run setup
npm run dev
set +x