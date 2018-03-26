/*
 * Copyright (C) 2018 Red Hat, Inc.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *   Red Hat, Inc. - initial API and implementation
 */

import { injectable, inject } from 'inversify';
import { Variable, VariableRegistry } from './variable';

/**
 * The variable resolver service should be used to resolve variables in strings.
 */
@injectable()
export class VariableResolverService {

    protected static VAR_REGEXP = /\$\{(.*?)\}/g;

    constructor(
        @inject(VariableRegistry) protected readonly variableRegistry: VariableRegistry
    ) { }

    /**
	 * Resolve variables in the given string.
	 * @returns promise resolved to the provided string with already resolved variables.
     * Never reject.
	 */
    async resolve(text: string): Promise<string> {
        const variablesToValues: { [varName: string]: string } = {};
        const promises: Promise<void>[] = [];

        this.searchVariables(text).forEach(variable => {
            const promise = variable.resolve().then(value => {
                if (value) {
                    variablesToValues[variable.name] = value;
                }
            });
            promises.push(promise);
        });

        await Promise.all(promises);

        const resolvedText = text.replace(VariableResolverService.VAR_REGEXP, (match: string, varName: string) => {
            const value = variablesToValues[varName];
            return value ? value : match;
        });
        return resolvedText;
    }

    /**
     * Finds all variables in the given string.
     */
    protected searchVariables(text: string): Variable[] {
        const variables: Variable[] = [];
        let match;
        while ((match = VariableResolverService.VAR_REGEXP.exec(text)) !== null) {
            const variableName = match[1];
            const variable = this.variableRegistry.getVariable(variableName);
            if (variable) {
                variables.push(variable);
            }
        }
        return variables;
    }
}
