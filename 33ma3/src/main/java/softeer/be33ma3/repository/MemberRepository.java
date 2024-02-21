package softeer.be33ma3.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import softeer.be33ma3.domain.Member;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findMemberByLoginId(String loginId);

    Optional<Member> findMemberByRefreshToken(String refreshToken);

    Optional<Member> findByLoginIdAndPassword(String loginId, String password);

    @Query("SELECT m.image.link FROM Member m WHERE m.memberId = :memberId")
    Optional<String> findProfileLinkByMemberId(Long memberId);
}
