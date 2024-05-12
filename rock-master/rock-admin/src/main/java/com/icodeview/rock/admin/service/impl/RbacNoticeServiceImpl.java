package com.icodeview.rock.admin.service.impl;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.icodeview.rock.admin.dto.RbacNoticeDto;
import com.icodeview.rock.admin.dto.RbacTypeDto;
import com.icodeview.rock.admin.mapper.RbacNoticeMapper;
import com.icodeview.rock.admin.pojo.RbacNotice;
import com.icodeview.rock.admin.pojo.RbacType;
import com.icodeview.rock.admin.service.RbacNoticeService;
import com.icodeview.rock.admin.vo.RbacNoticeVo;
import com.icodeview.rock.admin.vo.RbacTypeVo;
import com.icodeview.rock.vo.PageResult;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
@Service
public class RbacNoticeServiceImpl extends ServiceImpl<RbacNoticeMapper, RbacNotice> implements RbacNoticeService {
    @Override
    public PageResult<RbacNoticeVo> getIndex(String createby, Integer status, Integer belongto, Long pageNum, Long pageSize){
        Page<RbacNotice> rbacNoticePage = new Page<>(pageNum, pageSize);
        Page<RbacNotice> page = lambdaQuery()
                .and(StrUtil.isNotBlank(createby), q -> q.like(RbacNotice::getCreateby, "%" + createby + "%"))
                .eq(belongto != null , RbacNotice::getBelongto, belongto)
                .orderByDesc(RbacNotice::getId)
                .page(rbacNoticePage);
        List<RbacNoticeVo> record = page.getRecords().stream()
                .map(rbacNotice -> BeanUtil.copyProperties(rbacNotice, RbacNoticeVo.class))
                .collect(Collectors.toList());
        return PageResult.page(record,page);
    }

    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void createNotice(RbacNoticeDto noticeDto) {
        RbacNotice notice = BeanUtil.copyProperties(noticeDto, RbacNotice.class);
        notice.setCreateby(noticeDto.getCreateby());
        notice.setContent(noticeDto.getContent());
        notice.setStatus(noticeDto.getStatus());
        notice.setBelongto(noticeDto.getBelongto());
        notice.setCreatedAt(LocalDateTime.now());
        notice.setUpdatedAt(LocalDateTime.now());
        save(notice);
    }
    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void updateNotice(RbacNoticeDto noticeDto) {
        RbacNotice notice = BeanUtil.copyProperties(noticeDto, RbacNotice.class);
        notice.setId(noticeDto.getId());
        notice.setCreateby(noticeDto.getCreateby());
        notice.setContent(noticeDto.getContent());
        notice.setStatus(noticeDto.getStatus());
        notice.setBelongto(noticeDto.getBelongto());
        notice.setCreatedAt(LocalDateTime.now());
        notice.setUpdatedAt(LocalDateTime.now());
        updateById(notice);
    }

    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void deleteNotice(Integer id) {
        RbacNotice notice = getById(id);
        removeById(notice.getId());
    }
}
