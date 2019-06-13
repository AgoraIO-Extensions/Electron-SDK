import Logger from '../renderer/logger'
class Utils {
    getProperty(message, propertyName) {
        let readableText = ""
        try {
            let json = JSON.parse(message)
            readableText = json[propertyName]
        } catch(e) {
            Logger.error(e.stack)
        }
        return readableText
    }
    readableMessage(message) {
        let readableText = ""
        try {
            let json = JSON.parse(message)

            readableText = `${json.cmd} ${JSON.stringify(json.info)}`
        } catch(e) {
            Logger.error(e.stack)
        }
        return readableText
    }
    readableType(type) {
        let typeText = type
        switch(type) {
            case 1:
                typeText = "[APICall]"
                break;
            case 3:
                typeText = "[NonAPICall]"
                break;
            case 4:
                typeText = "[Report]"
                break;
            case 5:
                typeText = "[APIReturn]"
                break;
            case 7:
                typeText = "[NonAPIReturn]"
                break;
        }
        return typeText
    }
}

export default new Utils()