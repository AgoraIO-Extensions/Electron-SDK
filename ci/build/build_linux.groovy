// -*- mode: groovy -*-
// vim: set filetype=groovy :
@Library('agora-build-pipeline-library') _
import groovy.transform.Field

buildUtils = new agora.build.BuildUtils()

compileConfig = [
    "sourceDir": "electron-sdk",
    "docker": "",
    "buildCommand": "./ci/build/build_linux.sh",
    "non-publish": [
        "extraArgs": "",
    ],
    "publish": [
        "extraArgs": "",
    ]
]

def doBuild(buildVariables) { // buildVariables parameter is required by pipeline framework
    type = params.Package_Publish ? "publish" : "non-publish"
    command = compileConfig.buildCommand
    preCommand = compileConfig.get(type).get("preCommand", "")
    postCommand = compileConfig.get(type).get("postCommand", "")
    docker = compileConfig.docker
    extraArgs = compileConfig.get(type).extraArgs
    extraArgs += " " + params.getOrDefault("extra_args", "")
    commandConfig = [
        "command": command,
        "sourceRoot": "${compileConfig.sourceDir}",
        "extraArgs": extraArgs,
        "docker": docker
    ]
    loadResources(["config.json", "artifactory_utils.py"])
    buildUtils.customBuild(commandConfig, preCommand, postCommand)
}

def doPublish(buildVariables) { // buildVariables parameter is required by pipeline framework
    if (!params.Package_Publish) {
        return
    }
    (shortVersion, releaseVersion) = buildUtils.getBranchVersion()
    def archiveInfos = [
        [
          'type': 'ARTIFACTORY',
          'archivePattern': '*_linux_*.zip',
          'serverPath': "ELECTRON/${params.network_path}/${env.platform}/${params.arch}",
          'serverRepo': 'CSDC_repo' // ATTENTIONS: Update the artifactoryRepo if needed.
        ]
    ]
    def artifactoryUrls = archive.archiveFiles(archiveInfos)
    if (params.Upload_CDN) {
        doUploadCDN(artifactoryUrls)
    }
    sh 'rm -rf *.zip || true'
    if (params.isBuildDemo) {
        def payload1 = """
                    {
                        "msgtype": "text",
                        "text": {
                            "content": \"${env.NOTIFICATION_CONTENT}\n${artifactoryUrls.find {
                                it.startsWith('http') && it.contains('demo')
                            }}\"
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
    sh "rm -rf *.zip || true"
}

def doUploadCDN(artifactoryUrls) {
    if (!artifactoryUrls) {
        return
    }
    def cdnUrl = artifactoryUrls.find {
        it.startsWith('http') && !it.contains('demo')
    }.replace('artifactory-api.bj2.agoralab.co', 'artifactory.agoralab.co')
    build job: 'AD/Agora-Electron-Upload-CDN', propagate: false, parameters: [
        string(name: 'electron_sdk_url', value: cdnUrl),
        string(name: 'npmv', value: params.package_version),
        string(name: 'electron_version', value: 'napi')
    ], wait: true
}

pipelineLoad(this, "ELECTRON", "build", "linux", "electron_linux")
