import React, { useState, useEffect } from 'react';
import api from '../api/axios';

function ReviewPage() {
  const [reviews, setReviews] = useState([]);
  const [formData, setFormData] = useState({
    book: '',
    description: '',
    rating: 5,
    level: 3
  });

  // 댓글 관련 상태
  const [commentInputs, setCommentInputs] = useState({}); // { reviewId: "내용" }
  const [replyInputs, setReplyInputs] = useState({});    // { commentId: "내용" }
  const [activeReplyId, setActiveReplyId] = useState(null); // 어떤 댓글에 답글을 쓰는지 저장

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await api.get('reviews/');
      setReviews(response.data);
    } catch (error) {
      console.error("목록 로딩 실패", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 1. 리뷰 등록
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('reviews/', formData);
      setReviews([response.data, ...reviews]);
      setFormData({ book: '', description: '', rating: 5, level: 3 });
      alert("✨ 서평이 성공적으로 등록되었습니다!");
    } catch (error) {
      alert("❌ 등록에 실패했습니다.");
    }
  };

  // 2. 댓글 및 대댓글 등록
  const handleCommentSubmit = async (reviewId, parentId = null) => {
    const content = parentId ? replyInputs[parentId] : commentInputs[reviewId];
    if (!content || !content.trim()) return;

    try {
      const payload = {
        content: content,
        object_id: reviewId, 
        content_type: 'review', 
        parent: parentId     
      };

      await api.post('comments/', payload);
      
      // 입력창 초기화
      if (parentId) {
        setReplyInputs({ ...replyInputs, [parentId]: '' });
        setActiveReplyId(null);
      } else {
        setCommentInputs({ ...commentInputs, [reviewId]: '' });
      }
      
      fetchReviews(); 
    } catch (error) {
      alert("댓글 등록 실패");
    }
  };

  // --- UI 스타일 ---
  const styles = {
    pageWrapper: { display: 'flex', justifyContent: 'center', backgroundColor: '#f0f2f5', minHeight: '100vh', width: '100%', padding: '40px 20px', boxSizing: 'border-box' },
    container: { width: '100%', maxWidth: '720px', fontFamily: "'Pretendard', sans-serif" },
    header: { textAlign: 'center', marginBottom: '30px' },
    card: { backgroundColor: 'white', borderRadius: '16px', padding: '25px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginBottom: '25px' },
    input: { width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '1rem', backgroundColor: '#f9f9f9', boxSizing: 'border-box', marginBottom: '15px' },
    submitBtn: { width: '100%', padding: '14px', backgroundColor: '#1d9bf0', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' },
    commentSection: { marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #eee' },
    commentItem: { marginBottom: '15px', fontSize: '0.95rem' },
    replyItem: { marginLeft: '45px', marginTop: '10px', paddingLeft: '12px', borderLeft: '2px solid #e1e8ed', color: '#555' },
    actionBtn: { background: 'none', border: 'none', color: '#1d9bf0', fontSize: '0.8rem', cursor: 'pointer', padding: '0', marginTop: '4px' }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        
        <header style={styles.header}>
          <h1 style={{ color: '#1d9bf0', fontSize: '2.5rem', margin: 0 }}>BookLog</h1>
          <p style={{ color: '#666' }}>당신의 독서 기록을 가치있게</p>
        </header>

        {/* --- 리뷰 등록 섹션 --- */}
        <section style={styles.card}>
          <h3 style={{ marginTop: 0, marginBottom: '20px' }}>새로운 서평 남기기</h3>
          <form onSubmit={handleReviewSubmit}>
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>도서 번호(ID)</label>
            <input type="number" name="book" style={styles.input} value={formData.book} onChange={handleChange} required />
            
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>서평 내용</label>
            <textarea name="description" style={{ ...styles.input, minHeight: '100px' }} value={formData.description} onChange={handleChange} required />
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>평점</label>
                <input type="number" name="rating" placeholder="1-5" min="1" max="5" style={styles.input} value={formData.rating} onChange={handleChange} />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>난이도</label>
                <input type="number" name="level" placeholder="1-5" min="1" max="5" style={styles.input} value={formData.level} onChange={handleChange} />
              </div>
            </div>
            <button type="submit" style={styles.submitBtn}>작성 완료</button>
          </form>
        </section>

        {/* --- 리뷰 리스트 피드 --- */}
        <h3 style={{ paddingLeft: '10px', marginBottom: '15px' }}>최신 피드</h3>
        {reviews.map(rev => (
          <div key={rev.id} style={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <div style={{ fontWeight: 'bold' }}>👤 {rev.reviewer_name || '익명 독자'}</div>
              <div style={{ color: '#f59e0b' }}>⭐ {rev.rating} | Lv.{rev.level}</div>
            </div>
            <p style={{ lineHeight: '1.6', color: '#333', whiteSpace: 'pre-wrap' }}>{rev.description}</p>
            <div style={{ fontSize: '0.8rem', color: '#999', marginBottom: '10px' }}>
              {new Date(rev.posted_at).toLocaleDateString()}
            </div>

            {/* --- 댓글 영역 --- */}
            <div style={styles.commentSection}>
              {/* 새 댓글 입력창 */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <input 
                  placeholder="댓글을 남겨주세요..." 
                  style={{ ...styles.input, marginBottom: 0, padding: '8px 12px' }} 
                  value={commentInputs[rev.id] || ''}
                  onChange={(e) => setCommentInputs({ ...commentInputs, [rev.id]: e.target.value })}
                />
                <button onClick={() => handleCommentSubmit(rev.id)} style={{ ...styles.submitBtn, width: '70px', padding: '8px' }}>등록</button>
              </div>

              {/* 댓글 목록 (사용자 요청 로직 통합) */}
              {rev.comments?.filter(c => !c.parent).map(comment => ( 
                <div key={comment.id} style={styles.commentItem}> 
                  <div style={{ display: 'flex', gap: '8px' }}> 
                    <strong>{comment.writer?.nickname || comment.writer_name || "익명 사용자"}</strong> 
                    <span>{comment.content}</span> 
                  </div> 

                  <button 
                    style={styles.actionBtn} 
                    onClick={() => setActiveReplyId(activeReplyId === comment.id ? null : comment.id)}
                  >
                    {activeReplyId === comment.id ? '취소' : '답글 달기'} 
                  </button> 

                  {/* 답글 입력창 (활성화 시) */} 
                  {activeReplyId === comment.id && ( 
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px', marginLeft: '45px' }}> 
                      <input  
                        placeholder="답글 입력..."  
                        style={{ ...styles.input, marginBottom: 0, padding: '6px 10px', fontSize: '0.85rem' }}  
                        value={replyInputs[comment.id] || ''} 
                        onChange={(e) => setReplyInputs({ ...replyInputs, [comment.id]: e.target.value })} 
                      /> 
                      <button 
                        onClick={() => handleCommentSubmit(rev.id, comment.id)} 
                        style={{ ...styles.submitBtn, width: '60px', padding: '6px' }}
                      >
                        등록
                      </button> 
                    </div> 
                  )} 

                  {/* 대댓글(답글) 목록 */} 
                  {rev.comments?.filter(r => r.parent === comment.id).map(reply => ( 
                    <div key={reply.id} style={styles.replyItem}> 
                      <strong>{reply.writer?.nickname || reply.writer_name || "익명"}</strong> {reply.content} 
                    </div> 
                  ))} 
                </div> 
              ))}
              {(!rev.comments || rev.comments.length === 0) && (
                <p style={{ fontSize: '0.85rem', color: '#ccc', textAlign: 'center' }}>첫 댓글을 남겨보세요!</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReviewPage;