package com.joomidang.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

//CORS 설정 - 프론트엔드(React)에서 백엔드 API를 호출할 수 있도록 허용
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")                                                        //모든 API 경로에 적용
                .allowedOrigins("http://localhost:5173", "http://localhost:5174", "http://localhost:3000")  //Vite(5173/5174), CRA(3000)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")       //OPTIONS: preflight 요청 명시 허용
                .allowedHeaders("*")                                                      //모든 헤더 허용
                .allowCredentials(false)                                                  //쿠키 인증 미사용 (JWT/세션 미구현)
                .maxAge(3600);                                                            //preflight 캐시 1시간
    }

}
