import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Tipo para a Lógica da Interface
type InterfaceState = {
    selectedLanguage: "none" | "en" | "pt-BR";
    colorMode: "light" | "dark";
    contentViewerMode: "standard" | "media" | "text";

    activePage: string;
    isSubpageActive: boolean;
    activeSubpage: string;
    activeItem: string;

    isCookiesOpen: boolean;
    isMenuOpen: boolean;
    isSearchOpen: boolean;

    isCartOpen: boolean;
    isCartHelperOpen: boolean;

    isUserTabOpen: boolean;
    userTabNeedsUpdate: boolean;

    isControlPanelOpen: boolean;
};

// Estado inicial da interface
const initialInterfaceState: InterfaceState = {
    selectedLanguage: "none", // "none" | "en" | "pt-BR
    colorMode: "light",
    contentViewerMode: "standard",

    activePage: "home",
    isSubpageActive: false,
    activeSubpage: "No subpage selected",
    activeItem: "No item selected",

    isCookiesOpen: false,
    isMenuOpen: false,
    isSearchOpen: false,
    isCartOpen: false,
    isCartHelperOpen: false,
    isUserTabOpen: false,
    userTabNeedsUpdate: false,
    isControlPanelOpen: false,
};

// Define o slice da interface
const InterfaceSlice = createSlice({
    name: "interface_slice",
    initialState: initialInterfaceState,
    reducers: {
        setActiveLanguage: (state, action: PayloadAction<"none" | "en" | "pt-BR">) => {
            state.selectedLanguage = action.payload;
        },
        toggleColorMode: (state) => {
            console.log("Toggling color mode");
            state.colorMode = state.colorMode === "light" ? "dark" : "light";
        },
        setContentViewerMode: (state, action: PayloadAction<"standard" | "media" | "text">) => {
            state.contentViewerMode = action.payload;
        },

        setActivePage: (state, action: PayloadAction<string>) => {
            state.activePage = action.payload;
        },
        toggleIsSubpageActive: (state, action: PayloadAction<boolean>) => {
            state.isSubpageActive = action.payload;
        },
        setActiveSubpage: (state, action: PayloadAction<string>) => {
            state.activeSubpage = action.payload;
        },
        setActiveItem: (state, action: PayloadAction<string>) => {
            state.activeItem = action.payload;
        },

        toggleCookiesOpen: (state) => {
            state.isCookiesOpen = !state.isCookiesOpen;
        },
        closeMenu: (state) => {
            state.isMenuOpen = false;
        },
        toggleMenuOpen: (state) => {
            state.isMenuOpen = !state.isMenuOpen;
        },
        toggleSearchOpen: (state) => {
            state.isSearchOpen = !state.isSearchOpen;
        },
        toggleCartOpen: (state) => {
            state.isCartOpen = !state.isCartOpen;
        },
        setCartOpen: (state, action: PayloadAction<boolean>) => {
            state.isCartOpen = action.payload;
        },
        setCartHelperOpen: (state, action: PayloadAction<boolean>) => {
            state.isCartHelperOpen = action.payload;
        },
        toggleUserTabOpen: (state) => {
            state.isUserTabOpen = !state.isUserTabOpen;
        },

        setUserTabNeedsUpdate: (state, action: PayloadAction<boolean>) => {
            state.userTabNeedsUpdate = action.payload;
        },

        setUserTabOpen: (state, action: PayloadAction<boolean>) => {
            state.isUserTabOpen = action.payload;
        },

        setControlPanelOpen: (state, action: PayloadAction<boolean>) => {
            state.isControlPanelOpen = action.payload;
        },
    },
});

export const {
    setActiveLanguage,
    toggleColorMode,
    setContentViewerMode,

    setActivePage,
    toggleIsSubpageActive,
    setActiveSubpage,
    setActiveItem,

    toggleCookiesOpen,
    closeMenu,
    toggleMenuOpen,
    toggleSearchOpen,
    toggleCartOpen,
    setCartOpen,
    setCartHelperOpen,
    toggleUserTabOpen,
    setUserTabNeedsUpdate,
    setUserTabOpen,
    setControlPanelOpen,
} = InterfaceSlice.actions;

export default InterfaceSlice.reducer;
