import { state, config, cookieConfig, dom } from './global';
import { _log, _getKeys } from '../utils/general';
import { _resolveCurrentLanguageCode } from '../utils/language';

/**
 * Update config preferences
 * @param {import("./global").UserConfig} _userConfig
 */
export const _setConfig = (_userConfig) => {

    /**
     * Make user configuration globally available
     */
    state._userConfig = _userConfig;
    state._allTranslations = _userConfig.language.translations;
    state._allDefinedCategories = state._userConfig.categories;
    state._allCategoryNames = _getKeys(state._allDefinedCategories);

    /**
     * Save names of categories marked as readonly
     */
    for(var i=0; i<state._allCategoryNames.length; i++){
        if(state._allDefinedCategories[state._allCategoryNames[i]].readOnly === true)
            state._readOnlyCategories.push(state._allCategoryNames[i]);
    }

    _log('CookieConsent [CONFIG]: configuration:', _userConfig);

    if(typeof _userConfig.autoShow === 'boolean')
        config.autoShow = _userConfig.autoShow;

    /**
     * @type {i .CookieConfig}
     */
    var newCookieConfig = _userConfig.cookie;

    if(!!newCookieConfig && typeof newCookieConfig === 'object'){

        var name = newCookieConfig.name,
            domain = newCookieConfig.domain,
            path = newCookieConfig.path,
            sameSite = newCookieConfig.sameSite,
            expiresAfterDays = newCookieConfig.expiresAfterDays;

        name && (cookieConfig.name = name);
        domain && (cookieConfig.domain = domain);
        path && (cookieConfig.path = path);
        sameSite && (cookieConfig.sameSite = sameSite);
        expiresAfterDays && (cookieConfig.expiresAfterDays = expiresAfterDays);
    }

    var mode = _userConfig;
    var revision = _userConfig.revision;
    var autoClearCookies = _userConfig.autoClearCookies;
    var manageScriptTags = _userConfig.manageScriptTags;
    var hideFromBots = _userConfig.hideFromBots;

    if(mode === 'opt-out'){
        config.mode = mode;
    }

    if(typeof revision === 'number'){
        revision > -1 && (config.revision = revision);
        state._revisionEnabled = true;
    }

    if(typeof autoClearCookies === 'boolean'){
        config.autoClearCookies = autoClearCookies;
    }

    if(typeof manageScriptTags === 'boolean'){
        config.manageScriptTags = manageScriptTags;
    }

    if(hideFromBots === false) config.hideFromBots = false;

    if(config.hideFromBots === true){
        state._botAgentDetected = navigator &&
            ((navigator.userAgent && /bot|crawl|spider|slurp|teoma/i.test(navigator.userAgent)) || navigator.webdriver);
    }

    _log('CookieConsent [CONFIG]: autoClearCookies:', config.autoClearCookies);
    _log('CookieConsent [CONFIG]: revision enabled:', state._revisionEnabled);
    _log('CookieConsent [CONFIG]: manageScriptTags:', config.manageScriptTags);

    /**
     * Determine current language code
     */
    state._currentLanguageCode = _resolveCurrentLanguageCode();

    /**
     * Get translation relative to the current language code
     */
    state._currentTranslation = state._allTranslations[state._currentLanguageCode];

    _log('CookieConsent [LANG]: current language: \'' + state._currentLanguageCode + '\'');

    /**
     * Define document properties after config.
     * to avoid errors like "document is not defined"
     */
    dom._htmlDom = document.documentElement;
};