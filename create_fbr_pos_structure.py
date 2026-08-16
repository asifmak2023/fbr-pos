from pathlib import Path

# ============================================================
# FBR POS PROJECT STRUCTURE GENERATOR
# ============================================================

PROJECT_ROOT = Path(".")

# ------------------------------------------------------------
# Directories
# ------------------------------------------------------------

directories = [
    # Backend
    "backend/app/models",
    "backend/app/schemas",
    "backend/app/routes",
    "backend/app/services",
    "backend/app/utils",

    # Frontend
    "frontend/src/app/modules/auth",
    "frontend/src/app/modules/dashboard",
    "frontend/src/app/modules/products",
    "frontend/src/app/modules/contacts",
    "frontend/src/app/modules/sales",
    "frontend/src/app/modules/reports",
    "frontend/src/app/shared/services",
    "frontend/src/assets",
    "frontend/src/environments",
]

# ------------------------------------------------------------
# Files
# ------------------------------------------------------------

files = [
    # Backend
    "backend/app/main.py",
    "backend/app/config.py",
    "backend/app/database.py",

    # Models
    "backend/app/models/__init__.py",
    "backend/app/models/user.py",
    "backend/app/models/product.py",
    "backend/app/models/contact.py",
    "backend/app/models/sale.py",

    # Routes
    "backend/app/routes/auth.py",
    "backend/app/routes/products.py",
    "backend/app/routes/contacts.py",
    "backend/app/routes/sales.py",
    "backend/app/routes/reports.py",

    # Services
    "backend/app/services/fbr_client.py",

    # Backend configuration
    "backend/requirements.txt",
    "backend/.env",
    "backend/Dockerfile",

    # Frontend
    "frontend/src/app/app-routing.module.ts",
    "frontend/src/app/app.module.ts",
    "frontend/src/index.html",
    "frontend/angular.json",
    "frontend/package.json",

    # Root
    "docker-compose.yml",
    "README.md",
]

# ------------------------------------------------------------
# Create directories
# ------------------------------------------------------------

for directory in directories:
    path = PROJECT_ROOT / directory
    path.mkdir(parents=True, exist_ok=True)

# ------------------------------------------------------------
# Create files without overwriting existing files
# ------------------------------------------------------------

for file in files:
    path = PROJECT_ROOT / file

    if not path.exists():
        path.parent.mkdir(parents=True, exist_ok=True)
        path.touch()
        print(f"Created: {path}")
    else:
        print(f"Exists:  {path}")

# ------------------------------------------------------------
# Completion
# ------------------------------------------------------------

print()
print("=" * 60)
print("FBR POS project structure created successfully.")
print("=" * 60)
print(f"Project location: {PROJECT_ROOT.resolve()}")