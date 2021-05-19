import os
import platform
import sys

root_path = os.path.split(os.path.realpath(__file__))[0]
sdk_type = sys.argv[1]
sdk_version = sys.argv[2]
build_platform = sys.argv[3]

if platform.system() == "Windows":
    os.system("{} {} {} {}".format(os.path.join(root_path, "build.bat"), sdk_type, sdk_version, build_platform))
else:
    os.system("sh {} {} {} {}".format(os.path.join(root_path, "build.sh"), sdk_type, sdk_version, build_platform))
