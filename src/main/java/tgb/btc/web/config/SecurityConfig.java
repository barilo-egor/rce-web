package tgb.btc.web.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import tgb.btc.library.util.web.JacksonUtil;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Override
    protected void configure(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                .headers()
                .frameOptions().disable();
        httpSecurity
                .csrf()
                .disable();
        //  Доступ для всех
        httpSecurity
                .authorizeRequests()
                .antMatchers(
                        "/web/registration/**", "/static/**", "/extJS/**",
                        "/js/login/**", "/login/**", "/loginInstant",
                        "/js/util/**", "/js/registration/**",
                        "/js/api/**",
                        "/js/common/**",
                        "/api/**",
                        "/registerLogin", "/telegramLogin",
                        "/css/**", "/scss/**",
                        "/web/main",
                        "/registration/**",
                        "/api/**", "/documentation/**",
                        "/users/web/exist"
                )
                .permitAll();
        // Доступ для юзеров
        httpSecurity
                .authorizeRequests()
                .antMatchers(
                        "/", "/js/mainUser/**"
                )
                .hasRole("USER");

        // Доступ всех оставшихся юрлов
        httpSecurity
                .authorizeRequests()
                //Все остальные страницы требуют аутентификации
                .anyRequest()
                .hasAnyRole("ADMIN", "OPERATOR");

        // Конфигурация логина
        httpSecurity
                .formLogin()
                .loginPage("/login")
                //Перенарпавление на главную страницу после успешного входа
                .successHandler((request, response, exception) -> response.getWriter().write(
                        JacksonUtil.getEmpty().put("loginSuccess", true)
                                .toPrettyString()))
                .failureHandler((request, response, exception) -> response.getWriter().write(
                        JacksonUtil.getEmpty().put("loginSuccess", false)
                                .toPrettyString())
                )
                .permitAll()
                .and()
                .logout()
                .logoutUrl("/logout")
                .permitAll()
                .logoutSuccessUrl("/");
    }

    @Override
    public void configure(WebSecurity web) {
        web.ignoring()
                .antMatchers();
    }
}
