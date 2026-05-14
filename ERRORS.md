## Error Type
Console Error

## Error Message
Encountered a script tag while rendering React component. Scripts inside React components are never executed when rendering on the client. Consider using template tag instead (https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template).


    at script (<anonymous>:null:null)
    at ThemeProvider (src/components/providers/ThemeProvider.tsx:7:10)
    at RootLayout (src\app\layout.tsx:25:9)

## Code Frame
  5 |
  6 | export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
> 7 |   return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
    |          ^
  8 | }
  9 |

Next.js version: 16.2.4 (Turbopack)

## Error Type
Console Error

## Error Message
Encountered two children with the same key, `/expose`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version.


    at span (<anonymous>:null:null)
    at <anonymous> (src\components\layout\PageShell.tsx:73:15)
    at Array.map (<anonymous>:1:18)
    at PageShell (src\components\layout\PageShell.tsx:72:26)
    at ExposePage (src\app\expose\page.tsx:20:5)

## Code Frame
  71 |           >
  72 |             {breadcrumbs.map((crumb, i) => (
> 73 |               <span key={crumb.href} className="flex items-center gap-2">
     |               ^
  74 |                 {i > 0 && <ChevronRight className="w-3 h-3 opacity-30" />}
  75 |                 {i < breadcrumbs.length - 1 ? (
  76 |                   <Link

Next.js version: 16.2.4 (Turbopack)

## Error Type
Console Error

## Error Message
Encountered two children with the same key, `/stats`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version.


    at span (<anonymous>:null:null)
    at <anonymous> (src\components\layout\PageShell.tsx:73:15)
    at Array.map (<anonymous>:1:18)
    at PageShell (src\components\layout\PageShell.tsx:72:26)
    at StatsPage (src\app\stats\page.tsx:38:5)

## Code Frame
  71 |           >
  72 |             {breadcrumbs.map((crumb, i) => (
> 73 |               <span key={crumb.href} className="flex items-center gap-2">
     |               ^
  74 |                 {i > 0 && <ChevronRight className="w-3 h-3 opacity-30" />}
  75 |                 {i < breadcrumbs.length - 1 ? (
  76 |                   <Link

Next.js version: 16.2.4 (Turbopack)

## Error Type
Runtime Error

## Error Message
Event handlers cannot be passed to Client Component props.
  <... tabs={[...]} activeTab="all" onChange={function onChange}>
                                             ^^^^^^^^^^^^^^^^^^^
If you need interactivity, consider converting part of this to a Client Component.


    at stringify (<anonymous>:1:18)

Next.js version: 16.2.4 (Turbopack)


