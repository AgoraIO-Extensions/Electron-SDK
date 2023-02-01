// -*- mode: groovy -*-
// vim: set filetype=groovy :
@Library('agora-build-pipeline-library') _
import groovy.transform.Field

buildUtils = new agora.build.BuildUtils()

compileConfig = [
    "sourceDir": "electron-sdk",
    "non-publish": [
        "command": "./ci/build/build_windows.bat",
        "extraArgs": "",
    ],
    "publish": [
        "command": "./ci/build/build_windows.bat",
        "extraArgs": "",
    ]
]

def doBuild(buildVariables) {
    type = params.Package_Publish ? "publish" : "non-publish"
    command = compileConfig.get(type).command
    preCommand = compileConfig.get(type).get("preCommand", "")
    postCommand = compileConfig.get(type).get("postCommand", "")
    extraArgs = compileConfig.get(type).extraArgs
    extraArgs += " " + params.getOrDefault("extra_args", "")
    commandConfig = [
        "command": command,
        "sourceRoot": "${compileConfig.sourceDir}",
        "extraArgs": extraArgs
    ]
    loadResources(["config.json", "artifactory_utils.py"])
    buildUtils.customBuild(commandConfig, preCommand, postCommand)
}

def doPublish(buildVariables) {
    if (!params.Package_Publish) {
        return
    }
    (shortVersion, releaseVersion) = buildUtils.getBranchVersion()
    def archiveInfos = [
        [
          'type': 'ARTIFACTORY',
          'archivePattern': '*_windows_*.zip',
          'serverPath': "ELECTRON/${params.network_path}/${env.platform}/${params.arch}",
          'serverRepo': 'CSDC_repo' // ATTENTIONS: Update the artifactoryRepo if needed.
        ]
    ]
    def artifactoryUrls = archive.archiveFiles(archiveInfos)
    if (params.Upload_CDN) {
        doUploadCDN(artifactoryUrls)
    }
    bat 'del /f /Q *.zip'
    if (params.isBuildDemo) {
        def payload1 = """
                    {
                        "msgtype": "text",
                        "text": {
                            "content": \"${env.NOTIFICATION_CONTENT}\n${artifactoryUrls.find { it.startsWith('http') && it.contains('demo') }}\"
                        }
                    }
                    """
        httpRequest httpMode: 'POST',
                    acceptType: 'APPLICATION_JSON_UTF8',
                    contentType: 'APPLICATION_JSON_UTF8',
                    ignoreSslErrors: true, responseHandle: 'STRING',
                    requestBody: payload1,
                    url: "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=${env.NOTIFICATION_KEY}"
    }
    archiveArtifacts(artifacts: "package_urls", allowEmptyArchive:true)
    bat "del /f /Q *.zip"
}

def doUploadCDN(artifactoryUrls) {
    if (!artifactoryUrls) {
        return
    }
    def cdnUrl = artifactoryUrls.find { !it.contains('demo') }.replace('artifactory-api.bj2.agoralab.co', 'artifactory.agoralab.co')
    build job: 'AD/Agora-Electron-Upload-CDN', propagate: false, parameters: [
        string(name: 'electron_sdk_url', value: cdnUrl),
        string(name: 'npmv', value: params.package_version),
        string(name: 'electron_version', value: 'napi')
    ], wait: true
}

pipelineLoad(this, 'ELECTRON', 'build', 'windows', 'electron_windows')
