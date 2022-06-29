import datetime
import os
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
platform = platforms[int(index)]

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


# pack electron app
args = [
    'electron-packager',
    './',
    app_name,
    '--icon=timer.ico',
    '--overwrite',
    '--prune=true',
    f'--platform={platform}',
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
target = f'{app_name}-{platform}-{arch}/resources/app'
for file in ('.gitignore', 'build.py', 'package-lock.json', 'timer.ico'):
    os.remove(f'{target}/{file}')

# rename app
os.rename(f'{app_name}-{platform}-{arch}', f'{app_name}.{platfom_alias[platform]}.{arch_alias[arch]}')
