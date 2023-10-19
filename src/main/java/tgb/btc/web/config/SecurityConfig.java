package tgb.btc.web.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

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
                .csrf()
                .disable();
        //  Доступ для всех
        httpSecurity
                .authorizeRequests()
                .antMatchers(
                        "/web/registration/**", "/static/**", "/extJS/**", "/fontawesome/**",
                        "/js/login/**", "/login/**",
                        "/js/util/**", "/js/registration/**",
                        "/js/api/**",
                        "/api/**",
                        "/loginSuccess", "/loginError",
                        "/css/**", "/web/main",
                        "/api/**", "/documentation/**"
                )
                .permitAll();
        // Доступ для юзеров
        httpSecurity
                .authorizeRequests()
                .antMatchers(
                        "/", "js/mainUser/**"
                )
                .hasRole("USER");

        // Доступ для админов
        httpSecurity
                .authorizeRequests()
                .antMatchers(
                        "js/main/**", "web/main/**", "web/roles/**", "web/deal"
                )
                .hasRole("ADMIN");

        // Доступ для операторов
        httpSecurity
                .authorizeRequests()
                .antMatchers(
                        "js/main/**", "web/main/**", "web/roles/**", "web/deal"
                )
                .hasRole("OPERATOR");

        // Доступ всех оставшихся юрлов
        httpSecurity
                .authorizeRequests()
                //Все остальные страницы требуют аутентификации
                .anyRequest()
                .hasAnyRole("ADMIN", "OPERATOR");

        // Конфигурация логина
        httpSecurity
                .formLogin()
                .loginPage("/web/main")
                //Перенарпавление на главную страницу после успешного входа
                .defaultSuccessUrl("/loginSuccess", true)
                .failureUrl("/loginError")
                .permitAll()
                .and()
                .logout()
                .logoutUrl("/logout")
                .permitAll()
                .logoutSuccessUrl("/web/main");
    }

    @Override
    public void configure(WebSecurity web) {
        web.ignoring()
                .antMatchers();
    }
}
