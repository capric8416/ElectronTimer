import datetime
import os
import platform
import shutil
import subprocess


# configuration
version = '1.0.0'
app_name = 'ElectronTimer'
app_version = f'{datetime.datetime.today().year}.{version}'
company_name = 'AirFly'
app_copyright = f'Copyright (C) 2020 {company_name}'
app_bundle_id = 'com.tikcast.ElectronTimer'


# set platform
platforms = ('win32', 'darwin')
platfom_alias = {'win32': 'Windows', 'darwin': 'macOS'}
print('--------------------')
print('platfom')
print('--------------------')
for i, p in enumerate(platforms):
    print(i, p)
print('--------------------')
index = input('index: ')
platform_ = platforms[int(index)]

print('\n')

# set arch
archs = ('ia32', 'x64')
arch_alias = {'ia32': 'x86', 'x64': 'x64'}
print('--------------------')
print('arch')
print('--------------------')
for i, a in enumerate(archs):
    print(i, a)
print('--------------------')
index = input('index: ')
arch = archs[int(index)]


# rename old
if platform.system() == 'Darwin':
    # macOS
    shutil.rmtree(f'{app_name}.{platfom_alias[platform_]}.{arch_alias[arch]}.app', ignore_errors=True)
    if os.path.exists(f'{app_name}.{platfom_alias[platform_]}.{arch_alias[arch]}.app.zip'):
        os.remove(f'{app_name}.{platfom_alias[platform_]}.{arch_alias[arch]}.app.zip')
else:
    # Windows
    shutil.rmtree(f'{app_name}.{platfom_alias[platform_]}.{arch_alias[arch]}', ignore_errors=True)
    if os.path.exists(f'{app_name}.{platfom_alias[platform_]}.{arch_alias[arch]}.exe'):
        os.remove(f'{app_name}.{platfom_alias[platform_]}.{arch_alias[arch]}.exe')


# pack electron app
args = [
    'electron-packager',
    './',
    app_name,
    '--icon=timer.icns' if platform.system() == 'Darwin' else '--icon=timer.ico',
    '--overwrite',
    '--prune=true',
    f'--platform={platform_}',
    f'--arch={arch}',
    f'--app-copyright="{app_copyright}"',
    f'--app-version={app_version}',
    f'--executable-name="{app_name}"',

    f'--win32metadata.CompanyName="{company_name} (http://iairfly.com)"',
    f'--win32metadata.FileDescription="{app_name} {app_version}"',
    f'--win32metadata.OriginalFilename={app_name}',
    f'--win32metadata.ProductName={app_name}',
    f'--win32metadata.InternalName={app_name}',

    f'--app-bundle-id={app_bundle_id}'
]
subprocess.run(' '.join(args), shell=True)


# remove files
if platform.system() == 'Darwin':
    # macOS
    target = f'{app_name}-{platform_}-{arch}/{app_name}.app/Contents/Resources/app'
else:
    # Windows
    target = f'{app_name}-{platform_}-{arch}/resources/app'

for file in ('.gitignore', 'build.py', 'package-lock.json', 'timer.ico', 'timer.icns'):
    os.remove(f'{target}/{file}')

# rename app
if platform.system() == 'Darwin':
    # macOS
    os.rename(f'{app_name}-{platform_}-{arch}/{app_name}.app', f'{app_name}.{platfom_alias[platform_]}.{arch_alias[arch]}.app')
    shutil.rmtree(f'{app_name}-{platform_}-{arch}/')
else:
    # Windows
    os.rename(f'{app_name}-{platform_}-{arch}', f'{app_name}.{platfom_alias[platform_]}.{arch_alias[arch]}')
