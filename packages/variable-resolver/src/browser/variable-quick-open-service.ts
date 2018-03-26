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

import { inject, injectable } from 'inversify';
import { QuickOpenService, QuickOpenModel, QuickOpenItem, QuickOpenMode } from '@theia/core/lib/browser/quick-open/';
import { VariableRegistry } from './variable';

@injectable()
export class VariableQuickOpenService implements QuickOpenModel {

    protected items: QuickOpenItem[];

    constructor(
        @inject(VariableRegistry) protected readonly variableRegistry: VariableRegistry,
        @inject(QuickOpenService) protected readonly quickOpenService: QuickOpenService
    ) { }

    open(): void {
        const quickOpenItems = this.variableRegistry.getVariables().map(
            v => new VariableQuickOpenItem(v.name, v.description)
        );
        this.items = [...quickOpenItems];

        this.quickOpenService.open(this, {
            placeholder: 'Registered variables',
            fuzzyMatchLabel: true,
            fuzzyMatchDescription: true,
            fuzzySort: true
        });
    }

    onType(lookFor: string, acceptor: (items: QuickOpenItem[]) => void): void {
        acceptor(this.items);
    }
}

export class VariableQuickOpenItem extends QuickOpenItem {

    constructor(
        protected readonly name: string,
        protected readonly description?: string
    ) {
        super();
    }

    getLabel(): string {
        return '${' + this.name + '}';
    }

    getDetail(): string {
        return this.description || '';
    }

    run(mode: QuickOpenMode): boolean {
        if (mode !== QuickOpenMode.OPEN) {
            return false;
        }
        return false;
    }
}
