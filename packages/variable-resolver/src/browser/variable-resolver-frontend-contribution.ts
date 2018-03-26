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

import { injectable, inject, named } from 'inversify';
import { FrontendApplicationContribution } from '@theia/core/lib/browser';
import { Command, CommandContribution, CommandRegistry, ContributionProvider } from '@theia/core/lib/common';
import { VariableContribution, VariableRegistry } from './variable';
import { VariableQuickOpenService } from './variable-quick-open-service';

export const LIST_VARIABLES: Command = {
    id: 'variable.list',
    label: 'Variable: list all'
};

@injectable()
export class VariableResolverFrontendContribution implements FrontendApplicationContribution, CommandContribution {

    constructor(
        @inject(ContributionProvider) @named(VariableContribution)
        protected readonly contributionProvider: ContributionProvider<VariableContribution>,
        @inject(VariableRegistry) protected readonly variableRegistry: VariableRegistry,
        @inject(VariableQuickOpenService) protected readonly variableQuickOpenService: VariableQuickOpenService
    ) { }

    onStart(): void {
        this.contributionProvider.getContributions().forEach(contrib =>
            contrib.registerVariables(this.variableRegistry)
        );
    }

    registerCommands(commands: CommandRegistry): void {
        commands.registerCommand(LIST_VARIABLES, {
            isEnabled: () => true,
            execute: () => this.variableQuickOpenService.open()
        });
    }
}
