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

import { ContainerModule } from 'inversify';
import { bindContributionProvider, CommandContribution } from '@theia/core';
import { FrontendApplicationContribution } from '@theia/core/lib/browser';
import { VariableRegistry, VariableContribution } from './variable';
import { VariableQuickOpenService } from './variable-quick-open-service';
import { VariableResolverFrontendContribution } from './variable-resolver-frontend-contribution';
import { VariableResolverService } from './variable-resolver-service';

export default new ContainerModule(bind => {
    bind(VariableRegistry).toSelf().inSingletonScope();
    bind(VariableResolverService).toSelf().inSingletonScope();
    bindContributionProvider(bind, VariableContribution);

    bind(VariableResolverFrontendContribution).toSelf().inSingletonScope();
    for (const identifier of [FrontendApplicationContribution, CommandContribution]) {
        bind(identifier).toService(VariableResolverFrontendContribution);
    }

    bind(VariableQuickOpenService).toSelf().inSingletonScope();
});
