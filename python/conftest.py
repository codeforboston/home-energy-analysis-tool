import sys
import pytest
import os

def pytest_configure(config):
    # Check Python version
    version_info = sys.version_info
    major = version_info.major
    minor = version_info.minor
    print("Python version {major}.{minor}", major, minor)
    if major != 3:
        pytest.exit("❌ Python 3.12 or lower is required to run these tests.")
    
    # Check python and pytest path are the same
    python_path = sys.executable
    pytest_path = os.path.dirname(pytest.__file__)
    # Get the parent directory for both paths
    python_base_dir = os.path.dirname(os.path.dirname(python_path))
    pytest_base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(pytest_path))))

    print(f"Python path: {python_path}")
    print(f"Python base directory: {python_base_dir}")
    print(f"pytest path: {pytest_path}")
    print(f"pytest base directory: {pytest_base_dir}")
    if python_base_dir != pytest_base_dir:
        pytest.exit("❌ Python and pytest are from different sources.")
  


