import { readFileSync, existsSync } from 'fs';
import YAML from 'yaml';
import { configZod, Config } from '../Interfaces/Config';
import preferredDayList from '../Assets/preferredDay';
import * as log from '../Log';

const parseConfig = (): Config => {
    if (!existsSync('./config.yml')) {
        log.error('Not found config.yml file');
        process.exit(0);
    }

    const file = readFileSync('././config.yml', 'utf8');
    const configData = YAML.parse(file);
    configData.location.preferredDays = parsePreferredDays(configData.location.preferredDays);
    configData.personalInfo.phoneNumber = parsePhoneNumber(configData.personalInfo.phoneNumber);
    try {
        return configZod.parse(configData);
    } catch (e) {
        log.error('Config file is not valid');
        console.error(e);
        process.exit(1);
    }
};

export default parseConfig;

function parsePhoneNumber(phoneNumber: string) {
    if (!phoneNumber) return null;
    // Phone format is ########## and we want to convert it to (###) ###-####
    return phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
}

function parsePreferredDays(preferredDay: string[]): number[] {
    const convertedPreferredDay = preferredDay.map(day => preferredDayList[day.toLowerCase()]).filter(e => e);
    return convertedPreferredDay;
}
