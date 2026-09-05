import { initialState } from './catalogue'
import { validateState, type StudyState } from './model'
export const STORAGE_KEY='semester-v2-study'
export function loadStudy():{state:StudyState;error:string;raw:string|null}{try{const data=localStorage.getItem(STORAGE_KEY);return {state:data?validateState(JSON.parse(data)):initialState(),error:'',raw:data}}catch{return {state:initialState(),error:'Uložená data se nepodařilo načíst. Původní záznam zůstává zachovaný; obnov zálohu přes Import.',raw:null}}}
export function saveStudy(state:StudyState){localStorage.setItem(STORAGE_KEY,JSON.stringify(state))}
export function exportStudy(state:StudyState){const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`semester-zaloha-${new Date().toISOString().slice(0,10)}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
