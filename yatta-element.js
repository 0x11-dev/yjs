!function t(e,n,r){function i(s,u){if(!n[s]){if(!e[s]){var l="function"==typeof require&&require;if(!u&&l)return l(s,!0);if(o)return o(s,!0);throw new Error("Cannot find module '"+s+"'")}var p=n[s]={exports:{}};e[s][0].call(p.exports,function(t){var n=e[s][1][t];return i(n?n:t)},p,p.exports,t,e,n,r)}return n[s].exports}for(var o="function"==typeof require&&require,s=0;s<r.length;s++)i(r[s]);return i}({1:[function(t,e){var n;n=function(t,e,n,r){var i,o,s,u,l,p;return p=function(e){return e.uid.creator===n.getUserId()&&"string"!=typeof e.uid.op_number?t.broadcast(e):void 0},null!=t.invokeSync&&n.setInvokeSyncHandler(t.invokeSync),r.push(p),o=function(t){var e,n,r;r=[];for(e in t)n=t[e],r.push({user:e,state:n});return r},s=function(t){var e,n,r,i;for(n={},r=0,i=t.length;i>r;r++)e=t[r],n[e.user]=e.state;return n},l=function(){return o(n.getOperationCounter())},u=function(t){var e,r;return r=s(t),e={hb:n._encode(r),state_vector:o(n.getOperationCounter())}},i=function(t){return n.renewStateVector(s(t.state_vector)),e.applyOpsCheckDouble(t.hb)},t.whenSyncing(l,u,i),t.whenReceiving(function(t,r){return r.uid.creator!==n.getUserId()?e.applyOp(r):void 0}),null!=t._whenBoundToYatta?t._whenBoundToYatta():void 0},e.exports=n},{}],2:[function(t,e){var n;"undefined"!=typeof window&&null!==window&&(window.unprocessed_counter=0),"undefined"!=typeof window&&null!==window&&(window.unprocessed_exec_counter=0),"undefined"!=typeof window&&null!==window&&(window.unprocessed_types=[]),n=function(){function t(t,e){this.HB=t,this.types=e,this.unprocessed_ops=[]}return t.prototype.parseOperation=function(t){var e;if(e=this.types[t.type],null!=(null!=e?e.parse:void 0))return e.parse(t);throw new Error("You forgot to specify a parser for type "+t.type+". The message is "+JSON.stringify(t)+".")},t.prototype.applyOpsCheckDouble=function(t){var e,n,r,i;for(i=[],n=0,r=t.length;r>n;n++)e=t[n],null==this.HB.getOperation(e.uid)?i.push(this.applyOp(e)):i.push(void 0);return i},t.prototype.applyOps=function(t){return this.applyOp(t)},t.prototype.applyOp=function(t){var e,n,r,i;for(t.constructor!==Array&&(t=[t]),r=0,i=t.length;i>r;r++)n=t[r],e=this.parseOperation(n),null!=this.HB.getOperation(e)||this.HB.isExpectedOperation(e)&&e.execute()||(this.unprocessed_ops.push(e),"undefined"!=typeof window&&null!==window&&window.unprocessed_types.push(e.type));return this.tryUnprocessed()},t.prototype.tryUnprocessed=function(){for(var t,e,n,r,i,o;;){for(t=this.unprocessed_ops.length,n=[],o=this.unprocessed_ops,r=0,i=o.length;i>r;r++)e=o[r],null!=this.HB.getOperation(e)||this.HB.isExpectedOperation(e)&&e.execute()||n.push(e);if(this.unprocessed_ops=n,this.unprocessed_ops.length===t)break}return 0!==this.unprocessed_ops.length?this.HB.invokeSync():void 0},t}(),e.exports=n},{}],3:[function(t,e){var n,r=function(t,e){return function(){return t.apply(e,arguments)}};n=function(){function t(t){this.user_id=t,this.emptyGarbage=r(this.emptyGarbage,this),this.operation_counter={},this.buffer={},this.change_listeners=[],this.garbage=[],this.trash=[],this.performGarbageCollection=!0,this.garbageCollectTimeout=2e4,this.reserved_identifier_counter=0,setTimeout(this.emptyGarbage,this.garbageCollectTimeout)}return t.prototype.resetUserId=function(t){var e,n,r;if(r=this.buffer[this.user_id],null!=r){for(n in r)e=r[n],e.uid.creator=t;if(null!=this.buffer[t])throw new Error("You are re-assigning an old user id - this is not (yet) possible!");this.buffer[t]=r,delete this.buffer[this.user_id]}return this.operation_counter[t]=this.operation_counter[this.user_id],delete this.operation_counter[this.user_id],this.user_id=t},t.prototype.emptyGarbage=function(){var t,e,n,r;for(r=this.garbage,e=0,n=r.length;n>e;e++)t=r[e],"function"==typeof t.cleanup&&t.cleanup();return this.garbage=this.trash,this.trash=[],-1!==this.garbageCollectTimeout&&(this.garbageCollectTimeoutId=setTimeout(this.emptyGarbage,this.garbageCollectTimeout)),void 0},t.prototype.getUserId=function(){return this.user_id},t.prototype.addToGarbageCollector=function(){var t,e,n,r;if(this.performGarbageCollection){for(r=[],e=0,n=arguments.length;n>e;e++)t=arguments[e],null!=t?r.push(this.garbage.push(t)):r.push(void 0);return r}},t.prototype.stopGarbageCollection=function(){return this.performGarbageCollection=!1,this.setManualGarbageCollect(),this.garbage=[],this.trash=[]},t.prototype.setManualGarbageCollect=function(){return this.garbageCollectTimeout=-1,clearTimeout(this.garbageCollectTimeoutId),this.garbageCollectTimeoutId=void 0},t.prototype.setGarbageCollectTimeout=function(t){this.garbageCollectTimeout=t},t.prototype.getReservedUniqueIdentifier=function(){return{creator:"_",op_number:"_"+this.reserved_identifier_counter++,doSync:!1}},t.prototype.getOperationCounter=function(t){var e,n,r,i;if(null==t){n={},i=this.operation_counter;for(r in i)e=i[r],n[r]=e;return n}return this.operation_counter[t]},t.prototype.isExpectedOperation=function(t){var e,n;return null==(e=this.operation_counter)[n=t.uid.creator]&&(e[n]=0),t.uid.op_number<=this.operation_counter[t.uid.creator]},t.prototype._encode=function(t){var e,n,r,i,o,s,u,l,p,a;null==t&&(t={}),e=[],l=function(e,n){if(null==e||null==n)throw new Error("dah!");return null==t[e]||t[e]<=n},a=this.buffer;for(u in a){p=a[u];for(o in p)if(n=p[o],n.uid.doSync&&l(u,o)){if(r=n._encode(),null!=n.next_cl){for(i=n.next_cl;null!=i.next_cl&&l(i.uid.creator,i.uid.op_number);)i=i.next_cl;r.next=i.getUid()}else if(null!=n.prev_cl){for(s=n.prev_cl;null!=s.prev_cl&&l(s.uid.creator,s.uid.op_number);)s=s.prev_cl;r.prev=s.getUid()}e.push(r)}}return e},t.prototype.getNextOperationIdentifier=function(t){var e;return null==t&&(t=this.user_id),null==this.operation_counter[t]&&(this.operation_counter[t]=0),e={creator:t,op_number:this.operation_counter[t],doSync:!0},this.operation_counter[t]++,e},t.prototype.getOperation=function(t){var e,n;return null!=t.uid&&(t=t.uid),e=null!=(n=this.buffer[t.creator])?n[t.op_number]:void 0,null!=t.sub&&null!=e?e.retrieveSub(t.sub):e},t.prototype.addOperation=function(t){if(null==this.buffer[t.uid.creator]&&(this.buffer[t.uid.creator]={}),null!=this.buffer[t.uid.creator][t.uid.op_number])throw new Error("You must not overwrite operations!");if(t.uid.op_number.constructor!==String&&!this.isExpectedOperation(t))throw new Error("this operation was not expected!");return this.addToCounter(t),this.buffer[t.uid.creator][t.uid.op_number]=t,t},t.prototype.removeOperation=function(t){var e;return null!=(e=this.buffer[t.uid.creator])?delete e[t.uid.op_number]:void 0},t.prototype.setInvokeSyncHandler=function(t){return this.invokeSync=t},t.prototype.invokeSync=function(){},t.prototype.renewStateVector=function(t){var e,n,r;r=[];for(n in t)e=t[n],null==this.operation_counter[n]||this.operation_counter[n]<t[n]?r.push(this.operation_counter[n]=t[n]):r.push(void 0);return r},t.prototype.addToCounter=function(t){return null==this.operation_counter[t.uid.creator]&&(this.operation_counter[t.uid.creator]=0),"number"==typeof t.uid.op_number&&t.uid.creator!==this.getUserId()?t.uid.op_number===this.operation_counter[t.uid.creator]?this.operation_counter[t.uid.creator]++:this.invokeSync(t.uid.creator):void 0},t}(),e.exports=n},{}],4:[function(t,e){var n=[].slice,r={}.hasOwnProperty,i=function(t,e){function n(){this.constructor=t}for(var i in e)r.call(e,i)&&(t[i]=e[i]);return n.prototype=e.prototype,t.prototype=new n,t.__super__=e.prototype,t};e.exports=function(t){var e,r;return r={},e=[],r.Operation=function(){function r(t){this.is_deleted=!1,this.garbage_collected=!1,this.event_listeners=[],null!=t&&(this.uid=t)}return r.prototype.type="Operation",r.prototype.retrieveSub=function(){throw new Error("sub properties are not enable on this operation type!")},r.prototype.observe=function(t){return this.event_listeners.push(t)},r.prototype.unobserve=function(t){return this.event_listeners=this.event_listeners.filter(function(e){return t!==e})},r.prototype.deleteAllObservers=function(){return this.event_listeners=[]},r.prototype.callEvent=function(){return this.forwardEvent.apply(this,[this].concat(n.call(arguments)))},r.prototype.forwardEvent=function(){var t,e,r,i,o,s,u;for(r=arguments[0],t=2<=arguments.length?n.call(arguments,1):[],s=this.event_listeners,u=[],i=0,o=s.length;o>i;i++)e=s[i],u.push(e.call.apply(e,[r].concat(n.call(t))));return u},r.prototype.isDeleted=function(){return this.is_deleted},r.prototype.applyDelete=function(e){return null==e&&(e=!0),!this.garbage_collected&&(this.is_deleted=!0,e)?(this.garbage_collected=!0,t.addToGarbageCollector(this)):void 0},r.prototype.cleanup=function(){return t.removeOperation(this),this.deleteAllObservers()},r.prototype.setParent=function(t){this.parent=t},r.prototype.getParent=function(){return this.parent},r.prototype.getUid=function(){return null==this.uid.noOperation?this.uid:this.uid.alt},r.prototype.cloneUid=function(){var t,e,n,r;e={},r=this.getUid();for(t in r)n=r[t],e[t]=n;return e},r.prototype.dontSync=function(){return this.uid.doSync=!1},r.prototype.execute=function(){var n,r,i;if(this.is_executed=!0,null==this.uid&&(this.uid=t.getNextOperationIdentifier()),null==this.uid.noOperation)for(t.addOperation(this),r=0,i=e.length;i>r;r++)n=e[r],n(this._encode());return this},r.prototype.saveOperation=function(t,e){return null!=(null!=e?e.execute:void 0)?this[t]=e:null!=e?(null==this.unchecked&&(this.unchecked={}),this.unchecked[t]=e):void 0},r.prototype.validateSavedOperations=function(){var e,n,r,i,o,s;o={},i=this,s=this.unchecked;for(e in s)r=s[e],n=t.getOperation(r),n?this[e]=n:(o[e]=r,i=!1);return delete this.unchecked,i||(this.unchecked=o),i},r}(),r.Delete=function(t){function e(t,n){this.saveOperation("deletes",n),e.__super__.constructor.call(this,t)}return i(e,t),e.prototype.type="Delete",e.prototype._encode=function(){return{type:"Delete",uid:this.getUid(),deletes:this.deletes.getUid()}},e.prototype.execute=function(){var t;return this.validateSavedOperations()?(t=e.__super__.execute.apply(this,arguments),t&&this.deletes.applyDelete(this),t):!1},e}(r.Operation),r.Delete.parse=function(t){var e,n;return n=t.uid,e=t.deletes,new this(n,e)},r.Insert=function(t){function e(t,n,r,i,o){this.saveOperation("parent",o),this.saveOperation("prev_cl",n),this.saveOperation("next_cl",r),null!=i?this.saveOperation("origin",i):this.saveOperation("origin",n),e.__super__.constructor.call(this,t)}return i(e,t),e.prototype.type="Insert",e.prototype.applyDelete=function(t){var n,r,i;return null==this.deleted_by&&(this.deleted_by=[]),n=!1,null==this.parent||this.isDeleted()||null==t||(n=!0),null!=t&&this.deleted_by.push(t),r=!1,this.next_cl.isDeleted()&&(r=!0),e.__super__.applyDelete.call(this,r),n&&this.callOperationSpecificDeleteEvents(t),(null!=(i=this.prev_cl)?i.isDeleted():void 0)?this.prev_cl.applyDelete():void 0},e.prototype.cleanup=function(){var t,n,r,i,o;if(this.next_cl.isDeleted()){for(o=this.deleted_by,r=0,i=o.length;i>r;r++)t=o[r],t.cleanup();for(n=this.next_cl;"Delimiter"!==n.type;)n.origin===this&&(n.origin=this.prev_cl),n=n.next_cl;return this.prev_cl.next_cl=this.next_cl,this.next_cl.prev_cl=this.prev_cl,e.__super__.cleanup.apply(this,arguments)}},e.prototype.getDistanceToOrigin=function(){var t,e;for(t=0,e=this.prev_cl;;){if(this.origin===e)break;t++,e=e.prev_cl}return t},e.prototype.execute=function(){var t,n,r;if(this.validateSavedOperations()){if(null!=this.parent&&(null==this.prev_cl&&(this.prev_cl=this.parent.beginning),null==this.origin&&(this.origin=this.parent.beginning),null==this.next_cl&&(this.next_cl=this.parent.end)),null!=this.prev_cl){for(t=this.getDistanceToOrigin(),r=this.prev_cl.next_cl,n=t;;){if(r===this.next_cl)break;if(r.getDistanceToOrigin()===n)r.uid.creator<this.uid.creator&&(this.prev_cl=r,t=n+1);else{if(!(r.getDistanceToOrigin()<n))break;n-t<=r.getDistanceToOrigin()&&(this.prev_cl=r,t=n+1)}n++,r=r.next_cl}this.next_cl=this.prev_cl.next_cl,this.prev_cl.next_cl=this,this.next_cl.prev_cl=this}return this.setParent(this.prev_cl.getParent()),e.__super__.execute.apply(this,arguments),this.callOperationSpecificInsertEvents(),this}return!1},e.prototype.callOperationSpecificInsertEvents=function(){var t;return null!=(t=this.parent)?t.callEvent([{type:"insert",position:this.getPosition(),object:this.parent,changedBy:this.uid.creator,value:this.content}]):void 0},e.prototype.callOperationSpecificDeleteEvents=function(t){return this.parent.callEvent([{type:"delete",position:this.getPosition(),object:this.parent,length:1,changedBy:t.uid.creator}])},e.prototype.getPosition=function(){var t,e;for(t=0,e=this.prev_cl;;){if(e instanceof r.Delimiter)break;e.isDeleted()||t++,e=e.prev_cl}return t},e}(r.Operation),r.ImmutableObject=function(t){function e(t,n){this.content=n,e.__super__.constructor.call(this,t)}return i(e,t),e.prototype.type="ImmutableObject",e.prototype.val=function(){return this.content},e.prototype._encode=function(){var t;return t={type:this.type,uid:this.getUid(),content:this.content}},e}(r.Operation),r.ImmutableObject.parse=function(t){var e,n;return n=t.uid,e=t.content,new this(n,e)},r.Delimiter=function(t){function e(t,n){this.saveOperation("prev_cl",t),this.saveOperation("next_cl",n),this.saveOperation("origin",t),e.__super__.constructor.call(this,{noOperation:!0})}return i(e,t),e.prototype.type="Delimiter",e.prototype.applyDelete=function(){var t;for(e.__super__.applyDelete.call(this),t=this.prev_cl;null!=t;)t.applyDelete(),t=t.prev_cl;return void 0},e.prototype.cleanup=function(){return e.__super__.cleanup.call(this)},e.prototype.execute=function(){var t,n;if(null!=(null!=(t=this.unchecked)?t.next_cl:void 0))return e.__super__.execute.apply(this,arguments);if(null!=(n=this.unchecked)?n.prev_cl:void 0){if(this.validateSavedOperations()){if(null!=this.prev_cl.next_cl)throw new Error("Probably duplicated operations");return this.prev_cl.next_cl=this,e.__super__.execute.apply(this,arguments)}return!1}return null!=this.prev_cl&&null==this.prev_cl.next_cl?(delete this.prev_cl.unchecked.next_cl,this.prev_cl.next_cl=this,e.__super__.execute.apply(this,arguments)):e.__super__.execute.apply(this,arguments)},e.prototype._encode=function(){var t,e;return{type:this.type,uid:this.getUid(),prev:null!=(t=this.prev_cl)?t.getUid():void 0,next:null!=(e=this.next_cl)?e.getUid():void 0}},e}(r.Operation),r.Delimiter.parse=function(t){var e,n,r;return r=t.uid,n=t.prev,e=t.next,new this(r,n,e)},{types:r,execution_listener:e}}},{}],5:[function(t,e){var n,r={}.hasOwnProperty,i=function(t,e){function n(){this.constructor=t}for(var i in e)r.call(e,i)&&(t[i]=e[i]);return n.prototype=e.prototype,t.prototype=new n,t.__super__=e.prototype,t};n=t("./TextTypes"),e.exports=function(t){var e,r;return e=n(t),r=e.types,r.Object=function(e){function n(){return n.__super__.constructor.apply(this,arguments)}return i(n,e),n.prototype.type="Object",n.prototype.applyDelete=function(){return n.__super__.applyDelete.call(this)},n.prototype.cleanup=function(){return n.__super__.cleanup.call(this)},n.prototype.toJson=function(e){var i,o,s,u,l;null==e&&(e=!1),l=this.val(),i={};for(o in l)s=l[o],i[o]=s instanceof r.Object?s.toJson(e):s instanceof r.Array?s.toJson(e):e&&s instanceof r.Operation?s.val():s;return this.bound_json=i,null!=n.observe&&(u=this,n.observe(this.bound_json,function(t){var e,n,r,i;for(i=[],n=0,r=t.length;r>n;n++)e=t[n],null!=e.changedBy||"add"!==e.type&&!(e.type="update")?i.push(void 0):i.push(u.val(e.name,e.object[e.name]));return i}),this.observe(function(e){var r,i,o,s,l,p;for(p=[],s=0,l=e.length;l>s;s++)r=e[s],r.created_!==t.getUserId()?(i=n.getNotifier(u.bound_json),o=u.bound_json[r.name],null!=o?(i.performChange("update",function(){return u.bound_json[r.name]=u.val(r.name)},u.bound_json),p.push(i.notify({object:u.bound_json,type:"update",name:r.name,oldValue:o,changedBy:r.changedBy}))):(i.performChange("add",function(){return u.bound_json[r.name]=u.val(r.name)},u.bound_json),p.push(i.notify({object:u.bound_json,type:"add",name:r.name,oldValue:o,changedBy:r.changedBy})))):p.push(void 0);return p})),this.bound_json},n.prototype.val=function(t,e){var i,o,s,u,l,p;if(null!=t&&arguments.length>1){if(null!=e&&null!=e.constructor){if(u=r[e.constructor.name],null!=u&&null!=u.create){for(i=[],o=l=1,p=arguments.length;p>=1?p>l:l>p;o=p>=1?++l:--l)i.push(arguments[o]);return s=u.create.apply(null,i),n.__super__.val.call(this,t,s)}throw new Error("The "+e.constructor.name+"-type is not (yet) supported in Yatta.")}return n.__super__.val.call(this,t,e)}return n.__super__.val.call(this,t)},n.prototype._encode=function(){return{type:this.type,uid:this.getUid()}},n}(r.MapManager),r.Object.parse=function(t){var e;return e=t.uid,new this(e)},r.Object.create=function(t,e){var n,i,o;n=(new r.Object).execute();for(i in t)o=t[i],n.val(i,o,e);return n},r.Number={},r.Number.create=function(t){return t},e}},{"./TextTypes":7}],6:[function(t,e){var n,r={}.hasOwnProperty,i=function(t,e){function n(){this.constructor=t}for(var i in e)r.call(e,i)&&(t[i]=e[i]);return n.prototype=e.prototype,t.prototype=new n,t.__super__=e.prototype,t};n=t("./BasicTypes"),e.exports=function(t){var e,r;return e=n(t),r=e.types,r.MapManager=function(t){function e(t){this.map={},e.__super__.constructor.call(this,t)}return i(e,t),e.prototype.type="MapManager",e.prototype.applyDelete=function(){var t,n,r;r=this.map;for(t in r)n=r[t],n.applyDelete();return e.__super__.applyDelete.call(this)},e.prototype.cleanup=function(){return e.__super__.cleanup.call(this)},e.prototype.val=function(t,e){var n,r,i,o;if(arguments.length>1)return this.retrieveSub(t).replace(e),this;if(null!=t)return r=this.map[t],null==r||r.isContentDeleted()?void 0:r.val();i={},o=this.map;for(t in o)n=o[t],n.isContentDeleted()||(i[t]=n.val());return i},e.prototype["delete"]=function(t){var e;return null!=(e=this.map[t])&&e.deleteContent(),this},e.prototype.retrieveSub=function(t){var e,n,i,o,s;return null==this.map[t]&&(e={name:t},n=this,i=this.cloneUid(),i.sub=t,s={noOperation:!0,alt:i},o=new r.ReplaceManager(e,n,s),this.map[t]=o,o.setParent(this,t),o.execute()),this.map[t]},e}(r.Operation),r.ListManager=function(t){function e(t){this.beginning=new r.Delimiter(void 0,void 0),this.end=new r.Delimiter(this.beginning,void 0),this.beginning.next_cl=this.end,this.beginning.execute(),this.end.execute(),e.__super__.constructor.call(this,t)}return i(e,t),e.prototype.type="ListManager",e.prototype.execute=function(){return this.validateSavedOperations()?(this.beginning.setParent(this),this.end.setParent(this),e.__super__.execute.apply(this,arguments)):!1},e.prototype.getLastOperation=function(){return this.end.prev_cl},e.prototype.getFirstOperation=function(){return this.beginning.next_cl},e.prototype.toArray=function(){var t,e;for(t=this.beginning.next_cl,e=[];t!==this.end;)e.push(t),t=t.next_cl;return e},e.prototype.getOperationByPosition=function(t){var e;for(e=this.beginning;;){if(e instanceof r.Delimiter&&null!=e.prev_cl){for(e=e.prev_cl;e.isDeleted()||!(e instanceof r.Delimiter);)e=e.prev_cl;break}if(0>=t&&!e.isDeleted())break;e=e.next_cl,e.isDeleted()||(t-=1)}return e},e}(r.Operation),r.ReplaceManager=function(t){function e(t,n,r,i,o){this.event_properties=t,this.event_this=n,null==this.event_properties.object&&(this.event_properties.object=this.event_this),e.__super__.constructor.call(this,r,i,o)}return i(e,t),e.prototype.type="ReplaceManager",e.prototype.applyDelete=function(){var t;for(t=this.beginning;null!=t;)t.applyDelete(),t=t.next_cl;return e.__super__.applyDelete.call(this)},e.prototype.cleanup=function(){return e.__super__.cleanup.call(this)},e.prototype.callEventDecorator=function(t){var e,n,r,i,o,s;if(!this.isDeleted()){for(i=0,o=t.length;o>i;i++){e=t[i],s=this.event_properties;for(n in s)r=s[n],e[n]=r}this.event_this.callEvent(t)}return void 0},e.prototype.replace=function(t,e){var n,i;return n=this.getLastOperation(),i=new r.Replaceable(t,this,e,n,n.next_cl).execute(),void 0},e.prototype.isContentDeleted=function(){return this.getLastOperation().isDeleted()},e.prototype.deleteContent=function(){return new r.Delete(void 0,this.getLastOperation().uid).execute(),void 0},e.prototype.val=function(){var t;return t=this.getLastOperation(),"function"==typeof t.val?t.val():void 0},e.prototype._encode=function(){var t;return t={type:this.type,uid:this.getUid(),beginning:this.beginning.getUid(),end:this.end.getUid()}},e}(r.ListManager),r.Replaceable=function(t){function e(t,n,r,i,o,s,u){null!=t&&null!=t.creator?this.saveOperation("content",t):this.content=t,this.saveOperation("parent",n),e.__super__.constructor.call(this,r,i,o,s),this.is_deleted=u}return i(e,t),e.prototype.type="Replaceable",e.prototype.val=function(){return this.content},e.prototype.applyDelete=function(){var t,n,r,i;return t=e.__super__.applyDelete.apply(this,arguments),null!=this.content&&("Delimiter"!==this.next_cl.type&&"function"==typeof(n=this.content).deleteAllObservers&&n.deleteAllObservers(),"function"==typeof(r=this.content).applyDelete&&r.applyDelete(),"function"==typeof(i=this.content).dontSync&&i.dontSync()),this.content=null,t},e.prototype.cleanup=function(){return e.__super__.cleanup.apply(this,arguments)},e.prototype.callOperationSpecificInsertEvents=function(){var t;return"Delimiter"===this.next_cl.type&&"Delimiter"!==this.prev_cl.type?(this.is_deleted||(t=this.prev_cl.content,this.parent.callEventDecorator([{type:"update",changedBy:this.uid.creator,oldValue:t}])),this.prev_cl.applyDelete()):"Delimiter"!==this.next_cl.type?this.applyDelete():this.parent.callEventDecorator([{type:"add",changedBy:this.uid.creator}]),void 0},e.prototype.callOperationSpecificDeleteEvents=function(t){return"Delimiter"===this.next_cl.type?this.parent.callEventDecorator([{type:"delete",changedBy:t.uid.creator,oldValue:this.content}]):void 0},e.prototype._encode=function(){var t;if(t={type:this.type,parent:this.parent.getUid(),prev:this.prev_cl.getUid(),next:this.next_cl.getUid(),origin:this.origin.getUid(),uid:this.getUid(),is_deleted:this.is_deleted},this.content instanceof r.Operation)t.content=this.content.getUid();else{if(null!=this.content&&null!=this.content.creator)throw new Error("You must not set creator here!");t.content=this.content}return t},e}(r.Insert),r.Replaceable.parse=function(t){var e,n,r,i,o,s,u;return e=t.content,o=t.parent,u=t.uid,s=t.prev,r=t.next,i=t.origin,n=t.is_deleted,new this(e,o,u,s,r,i,n)},e}},{"./BasicTypes":4}],7:[function(t,e){var n,r={}.hasOwnProperty,i=function(t,e){function n(){this.constructor=t}for(var i in e)r.call(e,i)&&(t[i]=e[i]);return n.prototype=e.prototype,t.prototype=new n,t.__super__=e.prototype,t};n=t("./StructuredTypes"),e.exports=function(t){var e,r,o;return r=n(t),o=r.types,e=r.parser,o.TextInsert=function(t){function e(t,n,r,i,o,s){(null!=t?t.creator:void 0)?this.saveOperation("content",t):this.content=t,e.__super__.constructor.call(this,n,r,i,o,s)}return i(e,t),e.prototype.type="TextInsert",e.prototype.insert=function(t,e,n){var r;return r=this.getOperationByPosition(t),this.insertAfter(r,e,n)},e.prototype.getLength=function(){return this.isDeleted()?0:this.content.length},e.prototype.applyDelete=function(){return e.__super__.applyDelete.apply(this,arguments),this.content instanceof o.Operation&&this.content.applyDelete(),this.content=null},e.prototype.execute=function(){return this.validateSavedOperations()?(this.content instanceof o.Operation&&(this.content.insert_parent=this),e.__super__.execute.call(this)):!1},e.prototype.val=function(){return this.isDeleted()||null==this.content?"":this.content},e.prototype._encode=function(){var t,e;return t={type:this.type,uid:this.getUid(),prev:this.prev_cl.getUid(),next:this.next_cl.getUid(),origin:this.origin.getUid(),parent:this.parent.getUid()},t.content=null!=(null!=(e=this.content)?e.getUid:void 0)?this.content.getUid():this.content,t},e}(o.Insert),o.TextInsert.parse=function(t){var e,n,r,i,s,u;return e=t.content,u=t.uid,s=t.prev,n=t.next,r=t.origin,i=t.parent,new o.TextInsert(e,u,s,n,r,i)},o.Array=function(t){function e(){return e.__super__.constructor.apply(this,arguments)}return i(e,t),e.prototype.type="Array",e.prototype.applyDelete=function(){var t;for(t=this.end;null!=t;)t.applyDelete(),t=t.prev_cl;return e.__super__.applyDelete.call(this)},e.prototype.cleanup=function(){return e.__super__.cleanup.call(this)},e.prototype.toJson=function(t){var e,n,r,i,s,u;for(null==t&&(t=!1),r=this.val(),u=[],n=i=0,s=r.length;s>i;n=++i)e=r[n],n instanceof o.Object?u.push(n.toJson(t)):n instanceof o.Array?u.push(n.toJson(t)):t&&n instanceof o.Operation?u.push(n.val()):u.push(n);return u},e.prototype.val=function(t){var e,n;if(null!=t){if(e=this.getOperationByPosition(t+1),e instanceof o.Delimiter)throw new Error("this position does not exist");return e.val()}for(e=this.beginning.next_cl,n=[];e!==this.end;)n.push(e.val()),e=e.next_cl;return n},e.prototype.push=function(t){return this.insertAfter(this.end.prev_cl,t)},e.prototype.insertAfter=function(t,e,n){var r,i,s,u,l,p;for(i=function(t,e){var n;if(null!=t&&null!=t.constructor){if(n=o[t.constructor.name],null!=n&&null!=n.create)return n.create(t,e);throw new Error("The "+t.constructor.name+"-type is not (yet) supported in Yatta.")}return t},s=t.next_cl;s.isDeleted();)s=s.next_cl;if(t=s.prev_cl,e instanceof o.Operation)new o.TextInsert(e,void 0,t,s).execute();else for(l=0,p=e.length;p>l;l++)r=e[l],u=new o.TextInsert(i(r,n),void 0,t,s).execute(),t=u;return this},e.prototype.insert=function(t,e,n){var r;return r=this.getOperationByPosition(t),this.insertAfter(r,[e],n)},e.prototype["delete"]=function(t,e){var n,r,i,s,u;for(s=this.getOperationByPosition(t+1),r=[],i=u=0;(e>=0?e>u:u>e)&&!(s instanceof o.Delimiter);i=e>=0?++u:--u){for(n=new o.Delete(void 0,s).execute(),s=s.next_cl;!(s instanceof o.Delimiter)&&s.isDeleted();)s=s.next_cl;r.push(n._encode())}return this},e.prototype._encode=function(){var t;return t={type:this.type,uid:this.getUid()}},e}(o.ListManager),o.Array.parse=function(t){var e;return e=t.uid,new this(e)},o.Array.create=function(t,e){var n,r;if("mutable"===e)return r=(new o.Array).execute(),n=r.getOperationByPosition(0),r.insertAfter(n,t),r;if(null==e||"immutable"===e)return t;throw new Error('Specify either "mutable" or "immutable"!!')},o.String=function(t){function e(t){this.textfields=[],e.__super__.constructor.call(this,t)}return i(e,t),e.prototype.type="String",e.prototype.val=function(){var t,e;return t=function(){var t,n,r,i;for(r=this.toArray(),i=[],t=0,n=r.length;n>t;t++)e=r[t],null!=e.val?i.push(e.val()):i.push("");return i}.call(this),t.join("")},e.prototype.toString=function(){return this.val()},e.prototype.insert=function(t,n){return e.__super__.insert.call(this,t,n)},e.prototype.bind=function(t){var e,n,r,i,o,s,u,l;for(l=this.textfields,s=0,u=l.length;u>s;s++)if(n=l[s],n===t)return;return r=this,t.value=this.val(),this.textfields.push(t),null!=t.selectionStart&&null!=t.setSelectionRange?(e=function(e){var n,r;return n=t.selectionStart,r=t.selectionEnd,null!=e&&(n=e(n),r=e(r)),{left:n,right:r}},o=function(e){return t.setSelectionRange(e.left,e.right)},i=function(e){return t.value=e}):(e=function(e){var n,r,i,o;return o=t.childNodes[0],i=window.getSelection().getRangeAt(0),i.startContainer===o&&i.endContainer===o?(n=i.startOffset,r=i.endOffset,null!=e&&(n=e(n),r=e(r)),{left:n,right:r,isReal:!0}):{left:0,right:0}},o=function(e){var n,r,i;return i=t.childNodes[0],e.isReal?(n=new Range,n.setStart(i,e.left),n.setEnd(i,e.right),r=window.getSelection(),r.removeAllRanges(),r.addRange(n)):void 0},i=function(e){return t.textContent=e}),i(this.val()),this.observe(function(t){var n,s,u,l,p,a,c;for(c=[],p=0,a=t.length;a>p;p++)n=t[p],"insert"===n.type?(u=n.position,s=function(t){return u>=t?t:t+=1},l=e(s),i(r.val()),c.push(o(l))):"delete"===n.type?(u=n.position,s=function(t){return u>t?t:t-=1},l=e(s),i(r.val()),c.push(o(l))):c.push(void 0);return c}),t.onkeypress=function(n){var i,s,u,l;return r.is_deleted?(t.onkeypress=null,!0):(i=null,i=null!=n.key?32===n.charCode?" ":13===n.keyCode?"\n":n.key:window.String.fromCharCode(n.keyCode),i.length>0?(l=e(),u=Math.min(l.left,l.right),s=Math.abs(l.right-l.left),r["delete"](u,s),r.insert(u,i),l.left=u+i.length,l.right=l.left,o(l),n.preventDefault()):n.preventDefault())},t.onpaste=function(e){return r.is_deleted?(t.onpaste=null,!0):e.preventDefault()},t.oncut=function(e){return r.is_deleted?(t.oncut=null,!0):e.preventDefault()},t.onkeydown=function(n){var i,s,u,l,p,a;if(r.is_deleted)return t.onkeydown=null,!0;if(p=e(),l=Math.min(p.left,p.right),s=Math.abs(p.left-p.right),null!=n.keyCode&&8===n.keyCode){if(s>0)r["delete"](l,s),p.left=l,p.right=l,o(p);else if(null!=n.ctrlKey&&n.ctrlKey){for(a=null!=t.value?t.value:t.textContent,u=l,i=0,l>0&&(u--,i++);u>0&&" "!==a[u]&&"\n"!==a[u];)u--,i++;r["delete"](u,l-u),p.left=u,p.right=u,o(p)}else r["delete"](l-1,1);return n.preventDefault()}return null!=n.keyCode&&46===n.keyCode?s>0?(r["delete"](l,s),p.left=l,p.right=l,o(p)):(r["delete"](l,1),p.left=l,p.right=l,o(p)):void 0}},e.prototype._encode=function(){var t;return t={type:this.type,uid:this.getUid()}},e}(o.Array),o.String.parse=function(t){var e;return e=t.uid,new this(e)},o.String.create=function(t,e){var n;if("mutable"===e)return n=(new o.String).execute(),n.insert(0,t),n;if(null==e||"immutable"===e)return t;throw new Error('Specify either "mutable" or "immutable"!!')},r}},{"./StructuredTypes":6}],8:[function(t){var e,n;e=t("./yatta"),n=function(t){var e,n,r,i;for(n=r=0,i=t.children.length;i>=0?i>r:r>i;n=i>=0?++r:--r)e=t.children.item(n),null!=e.name&&(e.val=t.val.val(e.name));return t.val.observe(function(r){var i,o,s,u,l;for(l=[],s=0,u=r.length;u>s;s++)i=r[s],null!=i.name?l.push(function(){var r,s,u;for(u=[],n=r=0,s=t.children.length;s>=0?s>r:r>s;n=s>=0?++r:--r)e=t.children.item(n),null!=e.name&&e.name===i.name?(o=t.val.val(e.name),e.val!==o?u.push(e.val=o):u.push(void 0)):u.push(void 0);return u}()):l.push(void 0);return l})},Polymer("yatta-element",{ready:function(){return null!=this.connector?(this.val=new e(this.connector),n(this)):null!=this.val?n(this):void 0},valChanged:function(){return null!=this.val&&"Object"===this.val.type?n(this):void 0},connectorChanged:function(){return null==this.val?(this.val=new e(this.connector),n(this)):void 0}}),Polymer("yatta-property",{ready:function(){return null!=this.val&&null!=this.name&&(this.val.constructor===Object?this.val=this.parentElement.val(this.name,this.val).val(this.name):"string"==typeof this.val&&this.parentElement.val(this.name,this.val),"Object"===this.val.type)?n(this):void 0},valChanged:function(){var t;if(null!=this.val&&null!=this.name){if(this.val.constructor===Object)return this.val=this.parentElement.val.val(this.name,this.val).val(this.name);if("Object"===this.val.type)return n(this);if(null!=(null!=(t=this.parentElement.val)?t.val:void 0)&&this.val!==this.parentElement.val.val(this.name))return this.parentElement.val.val(this.name,this.val)}}})},{"./yatta":9}],9:[function(t,e){var n,r,i,o,s,u={}.hasOwnProperty,l=function(t,e){function n(){this.constructor=t}for(var r in e)u.call(e,r)&&(t[r]=e[r]);return n.prototype=e.prototype,t.prototype=new n,t.__super__=e.prototype,t};s=t("./Types/JsonTypes"),r=t("./HistoryBuffer"),n=t("./Engine"),i=t("./ConnectorAdapter"),o=function(t){var e,o,u,p,a;return a=null,null!=t.id?a=t.id:(a="_temp",t.whenUserIdSet(function(t){return a=t,e.resetUserId(t)})),e=new r(a),u=s(e),p=u.types,o=function(r){function o(){this.connector=t,this.HB=e,this.types=p,this.engine=new n(this.HB,u.types),i(this.connector,this.engine,this.HB,u.execution_listener),o.__super__.constructor.apply(this,arguments)}return l(o,r),o.prototype.getConnector=function(){return this.connector},o}(p.Object),new o(e.getReservedUniqueIdentifier()).execute()},e.exports=o,"undefined"!=typeof window&&null!==window&&null==window.Yatta&&(window.Yatta=o)},{"./ConnectorAdapter":1,"./Engine":2,"./HistoryBuffer":3,"./Types/JsonTypes":5}]},{},[8]);