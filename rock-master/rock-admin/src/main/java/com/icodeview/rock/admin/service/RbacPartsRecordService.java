package com.icodeview.rock.admin.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.icodeview.rock.admin.dto.RbacPartsRecordDto;
import com.icodeview.rock.admin.pojo.RbacPartsRecord;
import com.icodeview.rock.admin.vo.RbacPartsRecordVo;
import com.icodeview.rock.vo.PageResult;

public interface RbacPartsRecordService extends IService<RbacPartsRecord> {
    PageResult<RbacPartsRecordVo> getIndex(Integer id,Integer recordId,Integer partId,String action,Integer replacePart,Integer belongto,Long pageNum, Long pageSize);
    void createPartsRecord(RbacPartsRecordDto partsRecordDto);
    void deletePartsRecord(Integer id);
    void updateRartsRecord(RbacPartsRecordDto partsRecordDto);
}
