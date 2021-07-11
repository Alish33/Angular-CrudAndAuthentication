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
const architect_1 = require("@angular-devkit/architect");
const actions_1 = require("./actions");
const utils_1 = require("../utils");
exports.default = architect_1.createBuilder((options, context) => __awaiter(void 0, void 0, void 0, function* () {
    if (!context.target) {
        throw new Error('Cannot deploy the application without a target');
    }
    const firebaseProject = options.firebaseProject || utils_1.getFirebaseProjectName(context.workspaceRoot, context.target.project);
    if (!firebaseProject) {
        throw new Error('Cannot find firebase project for your app in .firebaserc');
    }
    const staticBuildTarget = { name: options.buildTarget || `${context.target.project}:build:production` };
    let serverBuildTarget;
    if (options.ssr) {
        serverBuildTarget = {
            name: options.universalBuildTarget || `${context.target.project}:server:production`
        };
    }
    try {
        process.env.FIREBASE_DEPLOY_AGENT = 'angularfire';
        yield actions_1.default(require('firebase-tools'), context, staticBuildTarget, serverBuildTarget, firebaseProject, options, process.env.FIREBASE_TOKEN);
    }
    catch (e) {
        console.error('Error when trying to deploy: ');
        console.error(e.message);
        return { success: false };
    }
    return { success: true };
}));
