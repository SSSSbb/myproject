package com.icodeview.rock.admin.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.icodeview.rock.admin.dto.RbacNoticeDto;
import com.icodeview.rock.admin.pojo.RbacNotice;
import com.icodeview.rock.admin.vo.RbacNoticeVo;
import com.icodeview.rock.admin.vo.RbacTypeVo;
import com.icodeview.rock.vo.PageResult;

public interface RbacNoticeService extends IService<RbacNotice> {
    PageResult<RbacNoticeVo> getIndex(String createby, Integer status,Integer belongto, Long pageNum, Long pageSize);
    void createNotice(RbacNoticeDto noticeDto);
    void deleteNotice(Integer id);
    void updateNotice(RbacNoticeDto noticeDto);
}
