declare class tipo_handle {
/**
 * @param {my_title} title
**/
static getConfirmation(title: string,user_message: string):boolean
static application_meta(title: string,user_message: string):boolean
static hideElement(element_class: string):boolean
static showElement(element_class: string):boolean
static getTipoDefinition(tipo_name: string,disableExpansion: boolean):boolean
static routeTo(title: string,user_message: string):boolean
static saveTipo(title: string,user_message: string):boolean
static saveTipos(title: string,user_message: string):boolean
static createTipo(title: string,user_message: string):boolean
static createTipos(title: string,user_message: string):boolean
static deleteTipo(title: string,user_message: string):boolean
static getTipo(title: string,user_message: string):boolean
static purgeTipo(title: string,user_message: string):boolean
static getTipos(title: string,user_message: string):boolean
static presentForm(title: string,user_message: string):boolean
static showMessage(title: string,user_message: string):boolean
static callAction(title: string,user_message: string):boolean
static toTipo(title: string,user_message: string):boolean
static setPerspective(title: string,user_message: string):boolean
static setMenuItem(title: string,user_message: string):boolean
static getMenuItem(title: string,user_message: string):boolean
static getTourItem(title: string,user_message: string):boolean
static setTourObject(title: string,user_message: string):boolean
static getISODate(title: string,user_message: string):boolean
static listUrl(title: string,user_message: string):boolean
static updateUrl(title: string,user_message: string):boolean
static createUrl(title: string,user_message: string):boolean
static detailUrl(title: string,user_message: string):boolean
static setUserMeta(title: string,user_message: string):boolean
}