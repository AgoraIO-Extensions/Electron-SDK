properties([
    buildDiscarder(logRotator(artifactDaysToKeepStr: '', artifactNumToKeepStr: '', daysToKeepStr: '7', numToKeepStr: '100')),
    parameters([
        string(name: 'electron_sdk_branch', defaultValue: '', description: 'Electron branch', trim: true),
      	booleanParam(name: 'is_tag_fetch', defaultValue: true),
        string(name: 'network_path', defaultValue: '', description: '', trim: true),
        string(name: 'package_version', defaultValue: 'package_version', trim: true),
        string(name: 'example_sdk_mode', defaultValue: '', description: '', trim: true),
        string(name: 'example_electron_version', defaultValue: '', description: '', trim: true),
        booleanParam(name: 'Upload_CDN', defaultValue: false),
        booleanParam(name: 'isBuildDemo', defaultValue: false),
        ]),
    [$class: 'ThrottleJobProperty',
        categories: [],
        limitOneJobWithMatchingParams: false,
        maxConcurrentPerNode: 1,
        maxConcurrentTotal: 0,
        paramsToUseForLimit: '',
        throttleEnabled: false,
        throttleOption: 'project']
])

timestamps {
    build job: 'AD/Sync_Github', propagate: false, parameters: [
          string(name: 'repos', value: 'electron-sdk'),
      ], wait: true
    def commonBuildParams = [
        string(name: 'electron_sdk_branch', value: params.electron_sdk_branch),
      	booleanParam(name:'is_tag_fetch', value: params.is_tag_fetch),
        string(name: 'network_path', value: params.network_path),
      	string(name: 'package_version', value: params.package_version),
        string(name: 'example_sdk_mode', value: params.example_sdk_mode),
        string(name: 'example_electron_version', value: params.example_electron_version),
        booleanParam(name: 'Package_Publish', value: true),
        booleanParam(name:'Clean_Clone', value: true),
        booleanParam(name:'isBuildSdk', value: params.Upload_CDN ? true : (params.isBuildDemo ? params.example_sdk_mode == "1" : false)),
        booleanParam(name:'isBuildDemo', value: params.isBuildDemo),
        booleanParam(name: 'Upload_CDN', value: params.Upload_CDN)
    ]

    def buildJobs = [
        "electron_mac_build": {
            build job: 'ELECTRON/build_mac', parameters: commonBuildParams + [
                string(name: 'arch', value: 'x64')
            ]
        },
        "electron_windows_x86_build": {
            build job: 'ELECTRON/build_windows', parameters: commonBuildParams + [
                string(name: 'arch', value: "ia32"),
            ]
        },
        "electron_windows_x64_build": {
            build job: 'ELECTRON/build_windows', parameters: commonBuildParams + [
                string(name: 'arch', value: "x64"),
            ]
        }
    ]
    parallel buildJobs
}
