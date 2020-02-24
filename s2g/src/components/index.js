import{App} from './App.jsx'
import {Control} from './Control.jsx'
import {Items} from './Items.jsx'
import {Lists} from './Lists.jsx'
import {Users} from './Users.jsx'
import {IoTest} from './IoTest.jsx'
import {IoHook} from './IoHook.jsx'

const multi =[
  {pri:'Lists', mul:[
    ['Lists', 'Items'],
  ]},
  {pri:'Items', mul:[
    ['Lists','Items' ],
  ]},
  ]

const panes= [1,1,2,2,3,3,4]


export {App, Control, Items, Lists, Users, IoTest, IoHook, panes, multi}