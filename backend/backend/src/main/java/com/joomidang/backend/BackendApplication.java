package com.joomidang.backend;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

//주미당 전통주 역직구 플랫폼 백엔드 애플리케이션 시작점
@SpringBootApplication
//@MapperScan: 해당 패키지 안에서 @Mapper 달린 인터페이스를 자동으로 찾아서 등록
@MapperScan("com.joomidang.backend")
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

}
