// hooks/useScroll.ts
import { useRef, useCallback } from 'react';

interface ScrollOptions {
    offset?: number;
    behavior?: ScrollBehavior;
}

/**
 * 요소로 스크롤하는 기능을 제공하는 커스텀 훅
 * @param headerRef 헤더 요소 참조 (스크롤 시 상단에 고정된 요소)
 * @param defaultOptions 기본 스크롤 옵션
 */
export const useScroll = (
    headerRef: React.RefObject<HTMLElement | null>,
    defaultOptions: ScrollOptions = { offset: -10, behavior: 'smooth' }
) => {
    // 섹션 요소들에 대한 참조를 저장하는 객체
    const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

    // 특정 요소로 스크롤하는 함수
    const scrollToElement = useCallback((element: HTMLElement | null, options?: ScrollOptions) => {
        if (!element) return;

        const mergedOptions = { ...defaultOptions, ...options };
        const currentHeaderHeight = headerRef.current?.offsetHeight || 0;
        const totalOffset = (mergedOptions.offset || 0) - currentHeaderHeight;

        const targetPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const scrollToPosition = targetPosition + totalOffset;

        window.scrollTo({
            top: scrollToPosition,
            behavior: mergedOptions.behavior || 'smooth'
        });
    }, [headerRef, defaultOptions]);

    // ID로 요소를 찾아 스크롤하는 함수
    const scrollToElementById = useCallback((id: string, options?: ScrollOptions) => {
        const element = document.getElementById(id);
        scrollToElement(element, options);
    }, [scrollToElement]);

    // 키(식별자)로 저장된 요소로 스크롤하는 함수
    const scrollToSection = useCallback((key: string, options?: ScrollOptions) => {
        const section = sectionRefs.current[key];
        scrollToElement(section, options);
    }, [scrollToElement]);

    // 요소 참조를 등록하는 함수 (ref 콜백)
    const registerSectionRef = useCallback((key: string) => (element: HTMLElement | null) => {
        sectionRefs.current[key] = element;
    }, []);

    return {
        sectionRefs,
        registerSectionRef,
        scrollToElement,
        scrollToElementById,
        scrollToSection
    };
};