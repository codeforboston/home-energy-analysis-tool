python3 -m venv .venv
call .venv/Scripts/activate.bat 
pip install -e .
pip install -r requirements-dev.txt
pip install --upgrade pip