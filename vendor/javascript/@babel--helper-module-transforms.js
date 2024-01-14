import*as e from"assert";import*as t from"@babel/core";import*as r from"@babel/helper-module-imports";import*as n from"@babel/helper-environment-visitor";import*as o from"@babel/helper-simple-access";import a from"./normalize-and-load-metadata.js";import"path";import"@babel/helper-validator-identifier";import"@babel/helper-split-export-declaration";var s=n;try{"default"in n&&(s=n.default)}catch(e){}var i=t;try{"default"in t&&(i=t.default)}catch(e){}var l={};Object.defineProperty(l,"__esModule",{value:true});l.default=rewriteThis$1;var u=s;var p=i;const{numericLiteral:c,unaryExpression:d}=p.types;const f=p.traverse.visitors.merge([u.default,{ThisExpression(e){e.replaceWith(d("void",c(0),true))}}]);function rewriteThis$1(e){(0,p.traverse)(e.node,Object.assign({},f,{noScope:true}))}var m=e;try{"default"in e&&(m=e.default)}catch(e){}var E=t;try{"default"in t&&(E=t.default)}catch(e){}var h=o;try{"default"in o&&(h=o.default)}catch(e){}var y={};Object.defineProperty(y,"__esModule",{value:true});y.default=rewriteLiveReferences;var b=m;var g=E;var S=h;const{assignmentExpression:P,cloneNode:I,expressionStatement:x,getOuterBindingIdentifiers:v,identifier:M,isArrowFunctionExpression:N,isClassExpression:A,isFunctionExpression:O,isIdentifier:R,isMemberExpression:T,isVariableDeclaration:w,jsxIdentifier:_,jsxMemberExpression:k,memberExpression:j,numericLiteral:C,sequenceExpression:L,stringLiteral:X,variableDeclaration:D,variableDeclarator:$}=g.types;function isInType(e){do{switch(e.parent.type){case"TSTypeAnnotation":case"TSTypeAliasDeclaration":case"TSTypeReference":case"TypeAnnotation":case"TypeAlias":return true;case"ExportSpecifier":return e.parentPath.parent.exportKind==="type";default:if(e.parentPath.isStatement()||e.parentPath.isExpression())return false}}while(e=e.parentPath)}function rewriteLiveReferences(e,t,r){const n=new Map;const o=new Map;const requeueInParent=t=>{e.requeue(t)};for(const[e,r]of t.source){for(const[t,o]of r.imports)n.set(t,[e,o,null]);for(const t of r.importsNamespace)n.set(t,[e,null,t])}for(const[e,r]of t.local){let t=o.get(e);if(!t){t=[];o.set(e,t)}t.push(...r.names)}const a={metadata:t,requeueInParent:requeueInParent,scope:e.scope,exported:o};e.traverse(H,a);const s=new Set([...Array.from(n.keys()),...Array.from(o.keys())]);(0,S.default)(e,s,false);const i={seen:new WeakSet,metadata:t,requeueInParent:requeueInParent,scope:e.scope,imported:n,exported:o,buildImportReference([e,n,o],a){const s=t.source.get(e);s.referenced=true;if(o){if(s.wrap){var i;a=(i=r(a,s.wrap))!=null?i:a}return a}let l=M(s.name);if(s.wrap){var u;l=(u=r(l,s.wrap))!=null?u:l}if(n==="default"&&s.interop==="node-default")return l;const p=t.stringSpecifiers.has(n);return j(l,p?X(n):M(n),p)}};e.traverse(W,i)}const H={Scope(e){e.skip()},ClassDeclaration(e){const{requeueInParent:t,exported:r,metadata:n}=this;const{id:o}=e.node;if(!o)throw new Error("Expected class to have a name");const a=o.name;const s=r.get(a)||[];if(s.length>0){const r=x(buildBindingExportAssignmentExpression(n,s,M(a),e.scope));r._blockHoist=e.node._blockHoist;t(e.insertAfter(r)[0])}},VariableDeclaration(e){const{requeueInParent:t,exported:r,metadata:n}=this;const o=e.node.kind==="var";for(const a of e.get("declarations")){const{id:s}=a.node;let{init:i}=a.node;if(!R(s)||!r.has(s.name)||N(i)||O(i)&&!i.id||A(i)&&!i.id){for(const o of Object.keys(a.getOuterBindingIdentifiers()))if(r.has(o)){const a=x(buildBindingExportAssignmentExpression(n,r.get(o),M(o),e.scope));a._blockHoist=e.node._blockHoist;t(e.insertAfter(a)[0])}}else{if(!i){if(o)continue;i=e.scope.buildUndefinedNode()}a.node.init=buildBindingExportAssignmentExpression(n,r.get(s.name),i,e.scope);t(a.get("init"))}}}};const buildBindingExportAssignmentExpression=(e,t,r,n)=>{const o=e.exportName;for(let e=n;e!=null;e=e.parent)e.hasOwnBinding(o)&&e.rename(o);return(t||[]).reduce(((t,r)=>{const{stringSpecifiers:n}=e;const a=n.has(r);return P("=",j(M(o),a?X(r):M(r),a),t)}),r)};const buildImportThrow=e=>g.template.expression.ast`
    (function() {
      throw new Error('"' + '${e}' + '" is read-only.');
    })()
  `;const W={ReferencedIdentifier(e){const{seen:t,buildImportReference:r,scope:n,imported:o,requeueInParent:a}=this;if(t.has(e.node))return;t.add(e.node);const s=e.node.name;const i=o.get(s);if(i){if(isInType(e))throw e.buildCodeFrameError(`Cannot transform the imported binding "${s}" since it's also used in a type annotation. Please strip type annotations using @babel/preset-typescript or @babel/preset-flow.`);const t=e.scope.getBinding(s);const o=n.getBinding(s);if(o!==t)return;const l=r(i,e.node);l.loc=e.node.loc;if((e.parentPath.isCallExpression({callee:e.node})||e.parentPath.isOptionalCallExpression({callee:e.node})||e.parentPath.isTaggedTemplateExpression({tag:e.node}))&&T(l))e.replaceWith(L([C(0),l]));else if(e.isJSXIdentifier()&&T(l)){const{object:t,property:r}=l;e.replaceWith(k(_(t.name),_(r.name)))}else e.replaceWith(l);a(e);e.skip()}},UpdateExpression(e){const{scope:t,seen:r,imported:n,exported:o,requeueInParent:a,buildImportReference:s}=this;if(r.has(e.node))return;r.add(e.node);const i=e.get("argument");if(i.isMemberExpression())return;const l=e.node;if(i.isIdentifier()){const r=i.node.name;if(t.getBinding(r)!==e.scope.getBinding(r))return;const a=o.get(r);const u=n.get(r);if((a==null?void 0:a.length)>0||u)if(u)e.replaceWith(P(l.operator[0]+"=",s(u,i.node),buildImportThrow(r)));else if(l.prefix)e.replaceWith(buildBindingExportAssignmentExpression(this.metadata,a,I(l),e.scope));else{const n=t.generateDeclaredUidIdentifier(r);e.replaceWith(L([P("=",I(n),I(l)),buildBindingExportAssignmentExpression(this.metadata,a,M(r),e.scope),I(n)]))}}a(e);e.skip()},AssignmentExpression:{exit(e){const{scope:t,seen:r,imported:n,exported:o,requeueInParent:a,buildImportReference:s}=this;if(r.has(e.node))return;r.add(e.node);const i=e.get("left");if(!i.isMemberExpression())if(i.isIdentifier()){const r=i.node.name;if(t.getBinding(r)!==e.scope.getBinding(r))return;const l=o.get(r);const u=n.get(r);if((l==null?void 0:l.length)>0||u){b(e.node.operator==="=","Path was not simplified");const t=e.node;if(u){t.left=s(u,i.node);t.right=L([t.right,buildImportThrow(r)])}e.replaceWith(buildBindingExportAssignmentExpression(this.metadata,l,t,e.scope));a(e)}}else{const r=i.getOuterBindingIdentifiers();const s=Object.keys(r).filter((r=>t.getBinding(r)===e.scope.getBinding(r)));const l=s.find((e=>n.has(e)));l&&(e.node.right=L([e.node.right,buildImportThrow(l)]));const u=[];s.forEach((t=>{const r=o.get(t)||[];r.length>0&&u.push(buildBindingExportAssignmentExpression(this.metadata,r,M(t),e.scope))}));if(u.length>0){let t=L(u);if(e.parentPath.isExpressionStatement()){t=x(t);t._blockHoist=e.parentPath.node._blockHoist}const r=e.insertAfter(t)[0];a(r)}}}},"ForOfStatement|ForInStatement"(e){const{scope:t,node:r}=e;const{left:n}=r;const{exported:o,imported:a,scope:s}=this;if(!w(n)){let r,i=false;const l=e.get("body").scope;for(const e of Object.keys(v(n)))if(s.getBinding(e)===t.getBinding(e)){if(o.has(e)){i=true;l.hasOwnBinding(e)&&l.rename(e)}a.has(e)&&!r&&(r=e)}if(!i&&!r)return;e.ensureBlock();const u=e.get("body");const p=t.generateUidIdentifierBasedOnNode(n);e.get("left").replaceWith(D("let",[$(I(p))]));t.registerDeclaration(e.get("left"));i&&u.unshiftContainer("body",x(P("=",n,p)));r&&u.unshiftContainer("body",x(buildImportThrow(r)))}}};var B=t;try{"default"in t&&(B=t.default)}catch(e){}var U={};Object.defineProperty(U,"__esModule",{value:true});U.toGetWrapperPayload=toGetWrapperPayload;U.wrapReference=wrapReference;var q=B;var F=a;function toGetWrapperPayload(e){return(t,r)=>{if(e===false)return null;if((0,F.isSideEffectImport)(r)||r.reexportAll)return null;if(e===true)return/\./.test(t)?null:"lazy";if(Array.isArray(e))return e.indexOf(t)===-1?null:"lazy";if(typeof e==="function")return e(t)?"lazy":null;throw new Error(".lazy must be a boolean, string array, or function")}}function wrapReference(e,t){return t==="lazy"?q.types.callExpression(e,[]):null}var z=t;try{"default"in t&&(z=t.default)}catch(e){}var V={};Object.defineProperty(V,"__esModule",{value:true});V.buildDynamicImport=buildDynamicImport$1;var G=z;V.getDynamicImportSource=function getDynamicImportSource(e){const[t]=e.arguments;return G.types.isStringLiteral(t)||G.types.isTemplateLiteral(t)?t:G.template.expression.ast`\`\${${t}}\``};function buildDynamicImport$1(e,t,r,n){const o=G.types.isCallExpression(e)?e.arguments[0]:e.source;if(G.types.isStringLiteral(o)||G.types.isTemplateLiteral(o)&&o.quasis.length===0)return t?G.template.expression.ast`
        Promise.resolve().then(() => ${n(o)})
      `:n(o);const a=G.types.isTemplateLiteral(o)?G.types.identifier("specifier"):G.types.templateLiteral([G.types.templateElement({raw:""}),G.types.templateElement({raw:""})],[G.types.identifier("specifier")]);return t?G.template.expression.ast`
      (specifier =>
        new Promise(r => r(${a}))
          .then(s => ${n(G.types.identifier("s"))})
      )(${o})
    `:r?G.template.expression.ast`
      (specifier =>
        new Promise(r => r(${n(a)}))
      )(${o})
    `:G.template.expression.ast`
      (specifier => ${n(a)})(${o})
    `}var Y={};Object.defineProperty(Y,"__esModule",{value:true});Y.default=getModuleName$1;{const e=getModuleName$1;Y.default=getModuleName$1=function getModuleName(t,r){var n,o,a,s;return e(t,{moduleId:(n=r.moduleId)!=null?n:t.moduleId,moduleIds:(o=r.moduleIds)!=null?o:t.moduleIds,getModuleId:(a=r.getModuleId)!=null?a:t.getModuleId,moduleRoot:(s=r.moduleRoot)!=null?s:t.moduleRoot})}}function getModuleName$1(e,t){const{filename:r,filenameRelative:n=r,sourceRoot:o=t.moduleRoot}=e;const{moduleId:a,moduleIds:s=!!a,getModuleId:i,moduleRoot:l=o}=t;if(!s)return null;if(a!=null&&!i)return a;let u=l!=null?l+"/":"";if(n){const e=o!=null?new RegExp("^"+o+"/?"):"";u+=n.replace(e,"").replace(/\.(\w*?)$/,"")}u=u.replace(/\\/g,"/");return i&&i(u)||u}var J=e;try{"default"in e&&(J=e.default)}catch(e){}var K=t;try{"default"in t&&(K=t.default)}catch(e){}var Q=r;try{"default"in r&&(Q=r.default)}catch(e){}var Z={};Object.defineProperty(Z,"__esModule",{value:true});Object.defineProperty(Z,"buildDynamicImport",{enumerable:true,get:function(){return ie.buildDynamicImport}});Z.buildNamespaceInitStatements=buildNamespaceInitStatements;Z.ensureStatementsHoisted=ensureStatementsHoisted;Object.defineProperty(Z,"getModuleName",{enumerable:true,get:function(){return le.default}});Object.defineProperty(Z,"hasExports",{enumerable:true,get:function(){return ae.hasExports}});Object.defineProperty(Z,"isModule",{enumerable:true,get:function(){return re.isModule}});Object.defineProperty(Z,"isSideEffectImport",{enumerable:true,get:function(){return ae.isSideEffectImport}});Z.rewriteModuleStatementsAndPrepareHeader=rewriteModuleStatementsAndPrepareHeader;Object.defineProperty(Z,"rewriteThis",{enumerable:true,get:function(){return ne.default}});Z.wrapInterop=wrapInterop;var ee=J;var te=K;var re=Q;var ne=l;var oe=y;var ae=a;var se=U;var ie=V;var le=Y;const{booleanLiteral:ue,callExpression:pe,cloneNode:ce,directive:de,directiveLiteral:fe,expressionStatement:me,identifier:Ee,isIdentifier:he,memberExpression:ye,stringLiteral:be,valueToNode:ge,variableDeclaration:Se,variableDeclarator:Pe}=te.types;Z.getDynamicImportSource=V.getDynamicImportSource;function rewriteModuleStatementsAndPrepareHeader(e,{exportName:t,strict:r,allowTopLevelThis:n,strictMode:o,noInterop:a,importInterop:s=(a?"none":"babel"),lazy:i,getWrapperPayload:l=se.toGetWrapperPayload(i!=null&&i),wrapReference:u=se.wrapReference,esNamespaceOnly:p,filename:c,constantReexports:d=arguments[1].loose,enumerableModuleMeta:f=arguments[1].loose,noIncompleteNsImportDetection:m}){(0,ae.validateImportInteropOption)(s);ee((0,re.isModule)(e),"Cannot process module statements in a script");e.node.sourceType="script";const E=(0,ae.default)(e,t,{importInterop:s,initializeReexports:d,getWrapperPayload:l,esNamespaceOnly:p,filename:c});n||(0,ne.default)(e);(0,oe.default)(e,E,u);if(o!==false){const t=e.node.directives.some((e=>e.value.value==="use strict"));t||e.unshiftContainer("directives",de(fe("use strict")))}const h=[];(0,ae.hasExports)(E)&&!r&&h.push(buildESModuleHeader(E,f));const y=buildExportNameListDeclaration(e,E);if(y){E.exportNameListName=y.name;h.push(y.statement)}h.push(...buildExportInitializationStatements(e,E,u,d,m));return{meta:E,headers:h}}function ensureStatementsHoisted(e){e.forEach((e=>{e._blockHoist=3}))}function wrapInterop(e,t,r){if(r==="none")return null;if(r==="node-namespace")return pe(e.hub.addHelper("interopRequireWildcard"),[t,ue(true)]);if(r==="node-default")return null;let n;if(r==="default")n="interopRequireDefault";else{if(r!=="namespace")throw new Error(`Unknown interop: ${r}`);n="interopRequireWildcard"}return pe(e.hub.addHelper(n),[t])}function buildNamespaceInitStatements(e,t,r=false,n=se.wrapReference){var o;const a=[];const s=Ee(t.name);for(const e of t.importsNamespace)e!==t.name&&a.push(te.template.statement`var NAME = SOURCE;`({NAME:e,SOURCE:ce(s)}));const i=(o=n(s,t.wrap))!=null?o:s;r&&a.push(...buildReexportsFromMeta(e,t,true,n));for(const r of t.reexportNamespace)a.push((te.types.isIdentifier(i)?te.template.statement`EXPORTS.NAME = NAMESPACE;`:te.template.statement`
            Object.defineProperty(EXPORTS, "NAME", {
              enumerable: true,
              get: function() {
                return NAMESPACE;
              }
            });
          `)({EXPORTS:e.exportName,NAME:r,NAMESPACE:ce(i)}));if(t.reexportAll){const n=buildNamespaceReexport(e,ce(i),r);n.loc=t.reexportAll.loc;a.push(n)}return a}const Ie={constant:te.template.statement`EXPORTS.EXPORT_NAME = NAMESPACE_IMPORT;`,constantComputed:te.template.statement`EXPORTS["EXPORT_NAME"] = NAMESPACE_IMPORT;`,spec:te.template.statement`
    Object.defineProperty(EXPORTS, "EXPORT_NAME", {
      enumerable: true,
      get: function() {
        return NAMESPACE_IMPORT;
      },
    });
    `};function buildReexportsFromMeta(e,t,r,n){var o;let a=Ee(t.name);a=(o=n(a,t.wrap))!=null?o:a;const{stringSpecifiers:s}=e;return Array.from(t.reexports,(([n,o])=>{let i=ce(a);o==="default"&&t.interop==="node-default"||(i=s.has(o)?ye(i,be(o),true):ye(i,Ee(o)));const l={EXPORTS:e.exportName,EXPORT_NAME:n,NAMESPACE_IMPORT:i};return r||he(i)?s.has(n)?Ie.constantComputed(l):Ie.constant(l):Ie.spec(l)}))}function buildESModuleHeader(e,t=false){return(t?te.template.statement`
        EXPORTS.__esModule = true;
      `:te.template.statement`
        Object.defineProperty(EXPORTS, "__esModule", {
          value: true,
        });
      `)({EXPORTS:e.exportName})}function buildNamespaceReexport(e,t,r){return(r?te.template.statement`
        Object.keys(NAMESPACE).forEach(function(key) {
          if (key === "default" || key === "__esModule") return;
          VERIFY_NAME_LIST;
          if (key in EXPORTS && EXPORTS[key] === NAMESPACE[key]) return;

          EXPORTS[key] = NAMESPACE[key];
        });
      `:te.template.statement`
        Object.keys(NAMESPACE).forEach(function(key) {
          if (key === "default" || key === "__esModule") return;
          VERIFY_NAME_LIST;
          if (key in EXPORTS && EXPORTS[key] === NAMESPACE[key]) return;

          Object.defineProperty(EXPORTS, key, {
            enumerable: true,
            get: function() {
              return NAMESPACE[key];
            },
          });
        });
    `)({NAMESPACE:t,EXPORTS:e.exportName,VERIFY_NAME_LIST:e.exportNameListName?(0,te.template)`
            if (Object.prototype.hasOwnProperty.call(EXPORTS_LIST, key)) return;
          `({EXPORTS_LIST:e.exportNameListName}):null})}function buildExportNameListDeclaration(e,t){const r=Object.create(null);for(const e of t.local.values())for(const t of e.names)r[t]=true;let n=false;for(const e of t.source.values()){for(const t of e.reexports.keys())r[t]=true;for(const t of e.reexportNamespace)r[t]=true;n=n||!!e.reexportAll}if(!n||Object.keys(r).length===0)return null;const o=e.scope.generateUidIdentifier("exportNames");delete r.default;return{name:o.name,statement:Se("var",[Pe(o,ge(r))])}}function buildExportInitializationStatements(e,t,r,n=false,o=false){const a=[];for(const[e,r]of t.local)if(r.kind==="import");else if(r.kind==="hoisted")a.push([r.names[0],buildInitStatement(t,r.names,Ee(e))]);else if(!o)for(const e of r.names)a.push([e,null]);for(const e of t.source.values()){if(!n){const n=buildReexportsFromMeta(t,e,false,r);const o=[...e.reexports.keys()];for(let e=0;e<n.length;e++)a.push([o[e],n[e]])}if(!o)for(const t of e.reexportNamespace)a.push([t,null])}a.sort((([e],[t])=>e<t?-1:t<e?1:0));const s=[];if(o)for(const[,e]of a)s.push(e);else{const r=100;for(let n=0;n<a.length;n+=r){let o=[];for(let i=0;i<r&&n+i<a.length;i++){const[r,l]=a[n+i];if(l!==null){if(o.length>0){s.push(buildInitStatement(t,o,e.scope.buildUndefinedNode()));o=[]}s.push(l)}else o.push(r)}o.length>0&&s.push(buildInitStatement(t,o,e.scope.buildUndefinedNode()))}}return s}const xe={computed:te.template.expression`EXPORTS["NAME"] = VALUE`,default:te.template.expression`EXPORTS.NAME = VALUE`,define:te.template.expression`Object.defineProperty(EXPORTS, "NAME", { enumerable:true, value: void 0, writable: true })["NAME"] = VALUE`};function buildInitStatement(e,t,r){const{stringSpecifiers:n,exportName:o}=e;return me(t.reduce(((e,t)=>{const r={EXPORTS:o,NAME:t,VALUE:e};return t==="__proto__"?xe.define(r):n.has(t)?xe.computed(r):xe.default(r)}),r))}const ve=Z.__esModule,Me=Z.buildDynamicImport,Ne=Z.getModuleName,Ae=Z.hasExports,Oe=Z.isModule,Re=Z.isSideEffectImport,Te=Z.rewriteThis,we=Z.getDynamicImportSource;const _e=Z.buildNamespaceInitStatements,ke=Z.ensureStatementsHoisted,je=Z.rewriteModuleStatementsAndPrepareHeader,Ce=Z.wrapInterop;export{ve as __esModule,Me as buildDynamicImport,_e as buildNamespaceInitStatements,Z as default,ke as ensureStatementsHoisted,we as getDynamicImportSource,Ne as getModuleName,Ae as hasExports,Oe as isModule,Re as isSideEffectImport,je as rewriteModuleStatementsAndPrepareHeader,Te as rewriteThis,Ce as wrapInterop};

