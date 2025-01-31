package tgb.btc.web.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;


@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity.headers(Customizer.withDefaults());
        httpSecurity.csrf(AbstractHttpConfigurer::disable);
        httpSecurity.exceptionHandling(Customizer.withDefaults());
        httpSecurity
                .authorizeHttpRequests(authz -> authz
                        .requestMatchers(
                                "/web/registration/**", "/extJS/**",
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
                                "/users/web/exist", "/util/isDev", "/deal/payment/new", "/favicon.ico"
                        )
                        .permitAll()
                        .requestMatchers("/deal/bot/changeWallet")
                        .hasRole("ADMIN")
                        .requestMatchers(
                                "/", "/js/mainUser/**"
                        )
                        .hasRole("USER")
                        .requestMatchers(
                                "/dashboard/api/**", "/js/apiDashboard/**", "/util/getNotificationSound", "/enum/**",
                                "/common/**"
                        )
                        .hasAnyRole("ADMIN", "OPERATOR", "API_CLIENT")
                        .anyRequest()
                        .authenticated())
                .formLogin(form -> form
                        .loginPage("/")
                        .permitAll()
                )
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl("/")
                        .permitAll()
                );
        return httpSecurity.build();
    }
}
