"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ngAdd = exports.ngAddSetupProject = exports.setupProject = void 0;
const utils_1 = require("./utils");
const ng_add_ssr_1 = require("./ng-add-ssr");
const ng_add_static_1 = require("./ng-add-static");
const setupProject = (host, options) => {
    const { path: workspacePath, workspace } = utils_1.getWorkspace(host);
    const { project, projectName } = utils_1.getProject(options, host);
    const config = {
        project: projectName,
        firebaseProject: options.firebaseProject
    };
    if (options.universalProject) {
        return ng_add_ssr_1.setupUniversalDeployment({
            workspace,
            workspacePath,
            options: config,
            tree: host,
            project
        });
    }
    else {
        return ng_add_static_1.setupStaticDeployment({
            workspace,
            workspacePath,
            options: config,
            tree: host,
            project
        });
    }
};
exports.setupProject = setupProject;
const ngAddSetupProject = (options) => (host, context) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        require('firebase-tools');
    }
    catch (e) {
        throw new Error('The NodePackageInstallTask does not appear to have completed successfully or we ran into a race condition. Please run the `ng add @angular/fire` command again.');
    }
    const projects = yield utils_1.listProjects();
    const { firebaseProject } = yield utils_1.projectPrompt(projects);
    const { project } = utils_1.getProject(options, host);
    const { universalProject } = yield utils_1.projectTypePrompt(project);
    if (universalProject) {
        host = ng_add_ssr_1.addFirebaseFunctionsDependencies(host, context);
    }
    return exports.setupProject(host, Object.assign(Object.assign({}, options), { firebaseProject, universalProject }));
});
exports.ngAddSetupProject = ngAddSetupProject;
exports.ngAdd = ng_add_static_1.addFirebaseHostingDependencies;
