import React from 'react';

import layout from '@splunk/react-page';
import SetupComponent from '@splunk/setup-component';
import DependencyCheck from '@splunk/setup-component/src/DependencyCheck';
import { SplunkThemeProvider } from '@splunk/themes';

import { defaultTheme, getThemeOptions } from '@splunk/splunk-utils/themes';

import { StyledContainer } from './StartStyles';

const themeProviderSettings = getThemeOptions(defaultTheme() || 'enterprise');

layout(
    <SplunkThemeProvider {...themeProviderSettings}>
        <StyledContainer>
            <DependencyCheck />
        </StyledContainer>
    </SplunkThemeProvider>
);
