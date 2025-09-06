import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { QueryProvider } from '@/lib/query-client';
import { Navbar } from '@/components/layout/navbar';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';

const inter = Inter({
	variable: '--font-inter',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Agent Prompts - AI Development Tools',
	description: 'Discover and access AI development agents for popular tech stacks',
	keywords: 'AI agents, development tools, tech stacks, programming assistants',
	authors: [{ name: 'Agent Prompts' }],
	openGraph: {
		title: 'Agent Prompts - AI Development Tools',
		description: 'Discover and access AI development agents for popular tech stacks',
		type: 'website',
		locale: 'en_US',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Agent Prompts - AI Development Tools',
		description: 'Discover and access AI development agents for popular tech stacks',
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en' suppressHydrationWarning>
			<head>
				<script defer data-website-id='68ba87f8f5da170177f2d7ad' data-domain='getagentprompts.com' src='https://datafa.st/js/script.js'></script>
			</head>
			<body className={`${inter.variable} antialiased`}>
				<ThemeProvider attribute='class' defaultTheme='dark' enableSystem={false} disableTransitionOnChange>
					<QueryProvider>
						<Navbar />
						{children}
					</QueryProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
