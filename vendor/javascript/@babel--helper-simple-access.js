import*as e from"@babel/types";var n="default"in e?e.default:e;var i={};Object.defineProperty(i,"__esModule",{value:true});i.default=simplifyAccess;var o=n;const{LOGICAL_OPERATORS:s,assignmentExpression:t,binaryExpression:r,cloneNode:d,identifier:a,logicalExpression:c,numericLiteral:p,sequenceExpression:l,unaryExpression:f}=o;const u={AssignmentExpression:{exit(e){const{scope:n,seen:i,bindingNames:o}=this;if("="===e.node.operator)return;if(i.has(e.node))return;i.add(e.node);const a=e.get("left");if(!a.isIdentifier())return;const p=a.node.name;if(!o.has(p))return;if(n.getBinding(p)!==e.scope.getBinding(p))return;const l=e.node.operator.slice(0,-1);if(s.includes(l))e.replaceWith(c(l,e.node.left,t("=",d(e.node.left),e.node.right)));else{e.node.right=r(l,d(e.node.left),e.node.right);e.node.operator="="}}}};u.UpdateExpression={exit(e){if(!this.includeUpdateExpression)return;const{scope:n,bindingNames:i}=this;const o=e.get("argument");if(!o.isIdentifier())return;const s=o.node.name;if(i.has(s)&&n.getBinding(s)===e.scope.getBinding(s))if(e.parentPath.isExpressionStatement()&&!e.isCompletionRecord()){const n="++"==e.node.operator?"+=":"-=";e.replaceWith(t(n,o.node,p(1)))}else if(e.node.prefix)e.replaceWith(t("=",a(s),r(e.node.operator[0],f("+",o.node),p(1))));else{const n=e.scope.generateUidIdentifierBasedOnNode(o.node,"old");const i=n.name;e.scope.push({id:n});const s=r(e.node.operator[0],a(i),p(1));e.replaceWith(l([t("=",a(i),f("+",o.node)),t("=",d(o.node),s),a(i)]))}}};function simplifyAccess(e,n){var i;e.traverse(u,{scope:e.scope,bindingNames:n,seen:new WeakSet,includeUpdateExpression:null==(i=arguments[2])||i})}const g=i.__esModule;export{g as __esModule,i as default};

