#!/bin/bash
echo "Start building framework..."

AgoraIosFrameworkDir=$1
cd $AgoraIosFrameworkDir

if [ ! -d "libs" ]; then
    echo "SDK path error, please check!"
    exit 1
fi

cd libs/
cur_path=`pwd`
framework_suffix=".xcframework"
frameworks=""
for file in `ls $cur_path`; do
    echo $file
    if [[ $file == *$framework_suffix* ]]; then
        frameworks="$frameworks $file"
    fi
done

echo "Frameworks found:$frameworks"
mkdir ALL_ARCHITECTURE
for framework in $frameworks; do
    binary_name=${framework%.*}
    echo "framework_name is $binary_name"
    cp -rf $binary_name.xcframework/ios-armv7_arm64/$binary_name.framework ALL_ARCHITECTURE/
    lipo -create $binary_name.xcframework/ios-x86_64-simulator/$binary_name.framework/$binary_name ALL_ARCHITECTURE/$binary_name.framework/$binary_name -o ALL_ARCHITECTURE/$binary_name.framework/$binary_name
done


# simulator_arch="x86_64"
# for framework in $frameworks; do
#     binary_name=${framework%.*}
#     echo "framework_name is $binary_name"
#     info=`file ALL_ARCHITECTURE/$framework/$binary_name`
#     echo "info $info"
#     if [[ $info == *$simulator_arch* ]]; then
#         echo "simulator $framework"
#         supported_platforms="\"iPhoneSimulator\""
#         plutil -replace CFBundleSupportedPlatforms -json "[$supported_platforms]" ALL_ARCHITECTURE/$framework/Info.plist || exit 1
#         lipo -remove armv7 ALL_ARCHITECTURE/$framework/$binary_name -output ALL_ARCHITECTURE/$framework/$binary_name
#         lipo -remove arm64 ALL_ARCHITECTURE/$framework/$binary_name -output ALL_ARCHITECTURE/$framework/$binary_name
#         xcodebuild -create-xcframework -framework $framework -framework ALL_ARCHITECTURE/$framework -output $binary_name.xcframework
#     else
#         xcodebuild -create-xcframework -framework $framework -output $binary_name.xcframework
#     fi
#     rm -rf $framework
# done


echo "Build framework successfully."
